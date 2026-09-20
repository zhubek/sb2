import { GraphQLScalarType, valueFromASTUntyped } from "graphql";
export const JsonScalar = new GraphQLScalarType({
  name: "JSON",
  description: "Validated content document data",
  serialize: (value) => value,
  parseValue: (value) => value,
  parseLiteral: (node) => valueFromASTUntyped(node),
});
