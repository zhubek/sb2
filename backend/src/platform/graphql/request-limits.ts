import {
  ValidationRule,
  GraphQLError,
  SelectionSetNode,
  FragmentDefinitionNode,
} from "graphql";
// Count expanded selections so fragment reuse cannot bypass the query budget.
export const requestLimits: ValidationRule = (context) => ({
  Document(node) {
    const fragments = new Map(
      node.definitions
        .filter(
          (d): d is FragmentDefinitionNode => d.kind === "FragmentDefinition",
        )
        .map((d) => [d.name.value, d]),
    );
    const operations = node.definitions.filter(
      (d) => d.kind === "OperationDefinition",
    );
    let fields = 0,
      roots = 0;
    let rejected = operations.length !== 1;
    const walk = (set: SelectionSetNode, depth: number, seen: Set<string>) => {
      if (depth > 10) {
        rejected = true;
        return;
      }
      for (const item of set.selections) {
        if (fields > 100 || roots > 2) {
          rejected = true;
          return;
        }
        if (item.kind === "Field") {
          fields++;
          if (depth === 0) roots++;
          if (item.selectionSet) walk(item.selectionSet, depth + 1, seen);
        } else if (item.kind === "InlineFragment")
          walk(item.selectionSet, depth, seen);
        else {
          const name = item.name.value;
          if (seen.has(name)) {
            rejected = true;
            return;
          }
          const f = fragments.get(name);
          if (f) walk(f.selectionSet, depth, new Set([...seen, name]));
        }
      }
    };
    for (const op of operations) {
      walk(op.selectionSet, 0, new Set());
      if (op.operation === "mutation" && roots > 1) rejected = true;
    }
    if (rejected || fields > 100 || roots > 2)
      context.reportError(
        new GraphQLError("Query exceeds the operation, field or depth limit", {
          nodes: node,
        }),
      );
  },
});
