import { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  FormSection, SectionTitle, FieldWrapper, FieldLabel,
  Input, SaveButton, Row, AddBtn, AddItemButton,
  ItemList, ItemCard, ItemHeader, ItemHeaderLeft, ItemTitle, ItemSubtitle,
  ItemHeaderRight, ItemBody, DeleteBtn, CollapseIcon, SavedBadge, ImagePreview,
} from './AdminStyles';

function Field({ label, children }) {
  return (
    <FieldWrapper>
      <FieldLabel>{label}</FieldLabel>
      {children}
    </FieldWrapper>
  );
}

function SkillItem({ item, onChange, onDelete }) {
  return (
    <Row style={{ alignItems: 'flex-start', gap: 12 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Input
          value={item.name}
          onChange={e => onChange({ ...item, name: e.target.value })}
          placeholder="Skill name (e.g. React Js)"
        />
        <Input
          value={item.image}
          onChange={e => onChange({ ...item, image: e.target.value })}
          placeholder="Icon image URL"
        />
        {item.image && <ImagePreview src={item.image} alt={item.name} onError={e => { e.target.style.display = 'none'; }} />}
      </div>
      <DeleteBtn type="button" onClick={onDelete} style={{ marginTop: 8 }}>Remove</DeleteBtn>
    </Row>
  );
}

function CategoryCard({ category, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false);

  const updateSkill = (idx, updated) => {
    const skills = category.skills.map((s, i) => (i === idx ? updated : s));
    onUpdate({ ...category, skills });
  };

  const addSkill = () => {
    onUpdate({ ...category, skills: [...(category.skills || []), { name: '', image: '' }] });
    setOpen(true);
  };

  const removeSkill = (idx) => {
    onUpdate({ ...category, skills: category.skills.filter((_, i) => i !== idx) });
  };

  return (
    <ItemCard>
      <ItemHeader onClick={() => setOpen(o => !o)}>
        <ItemHeaderLeft>
          <ItemTitle>{category.title || 'Untitled Category'}</ItemTitle>
          <ItemSubtitle>{category.skills?.length || 0} skills</ItemSubtitle>
        </ItemHeaderLeft>
        <ItemHeaderRight>
          <DeleteBtn type="button" onClick={e => { e.stopPropagation(); onDelete(); }}>Delete</DeleteBtn>
          <CollapseIcon $open={open}>▼</CollapseIcon>
        </ItemHeaderRight>
      </ItemHeader>

      {open && (
        <ItemBody>
          <Field label="Category Title">
            <Input value={category.title} onChange={e => onUpdate({ ...category, title: e.target.value })} placeholder="e.g. Frontend" />
          </Field>

          <FieldWrapper>
            <FieldLabel>Skills</FieldLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {(category.skills || []).map((skill, idx) => (
                <SkillItem
                  key={idx}
                  item={skill}
                  onChange={updated => updateSkill(idx, updated)}
                  onDelete={() => removeSkill(idx)}
                />
              ))}
            </div>
          </FieldWrapper>

          <AddBtn type="button" onClick={addSkill}>+ Add Skill</AddBtn>
        </ItemBody>
      )}
    </ItemCard>
  );
}

export default function SkillsForm() {
  const { skills, updateSection } = usePortfolio();
  const [categories, setCategories] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (skills) setCategories(JSON.parse(JSON.stringify(skills))); }, [skills]);

  const updateCategory = (idx, updated) => setCategories(cats => cats.map((c, i) => (i === idx ? updated : c)));
  const deleteCategory = (idx) => setCategories(cats => cats.filter((_, i) => i !== idx));
  const addCategory = () => setCategories(cats => [...cats, { title: 'New Category', skills: [] }]);

  const handleSave = () => {
    updateSection('skills', categories);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <FormSection>
      <SectionTitle>Skills</SectionTitle>

      <ItemList>
        {categories.map((cat, idx) => (
          <CategoryCard
            key={idx}
            category={cat}
            onUpdate={updated => updateCategory(idx, updated)}
            onDelete={() => deleteCategory(idx)}
          />
        ))}
      </ItemList>

      <AddItemButton type="button" onClick={addCategory}>+ Add Skill Category</AddItemButton>

      <Row>
        <SaveButton type="button" onClick={handleSave}>Save Skills</SaveButton>
        {saved && <SavedBadge>✓ Saved!</SavedBadge>}
      </Row>
    </FormSection>
  );
}
