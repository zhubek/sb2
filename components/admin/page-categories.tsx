import { BookOpen, FileText, GraduationCap, LayoutTemplate, LogIn, Shapes } from "lucide-react";

export type PageCategory = { id: string; title: string; description: string; count: number };
const icons = { landing: LayoutTemplate, access: LogIn, navigator: BookOpen, student: GraduationCap, teacher: FileText, shared: Shapes };

export default function PageCategories({ categories, selected, onSelect }: {
  categories: PageCategory[]; selected: string; onSelect: (id: string) => void;
}) {
  return <section className="admin-page-categories" aria-label="Категории страниц">
    <div className="admin-page-categories-heading">
      <div><h2>Что хотите изменить?</h2><p>Выберите раздел или ищите сразу по всем страницам.</p></div>
      <button type="button" className={`admin-category-all ${!selected ? 'active' : ''}`} aria-pressed={!selected} onClick={() => onSelect('')}>
        Все страницы <span>{categories.reduce((sum, category) => sum + category.count, 0)}</span>
      </button>
    </div>
    <div className="admin-page-category-grid">
      {categories.map(category => {
        const Icon = icons[category.id as keyof typeof icons] ?? FileText;
        return <button type="button" key={category.id} className={`admin-page-category ${selected === category.id ? 'active' : ''}`}
          aria-pressed={selected === category.id} onClick={() => onSelect(category.id)}>
          <Icon size={19} aria-hidden="true"/>
          <span className="admin-page-category-copy"><strong>{category.title}</strong><small>{category.description}</small></span>
          <span className="admin-page-category-count">{category.count}</span>
        </button>;
      })}
    </div>
  </section>;
}
