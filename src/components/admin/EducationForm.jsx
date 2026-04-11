import { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  FormSection, SectionTitle, FieldWrapper, FieldLabel,
  Input, Textarea, SaveButton, Row, AddItemButton,
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

function EducationItem({ item, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false);
  const set = (field, value) => onUpdate({ ...item, [field]: value });

  return (
    <ItemCard>
      <ItemHeader onClick={() => setOpen(o => !o)}>
        <ItemHeaderLeft>
          <ItemTitle>{item.school || 'New Education'}</ItemTitle>
          <ItemSubtitle>{item.degree} {item.date ? `· ${item.date}` : ''}</ItemSubtitle>
        </ItemHeaderLeft>
        <ItemHeaderRight>
          <DeleteBtn type="button" onClick={e => { e.stopPropagation(); onDelete(); }}>Delete</DeleteBtn>
          <CollapseIcon $open={open}>▼</CollapseIcon>
        </ItemHeaderRight>
      </ItemHeader>

      {open && (
        <ItemBody>
          <Field label="School / Institution">
            <Input value={item.school || ''} onChange={e => set('school', e.target.value)} placeholder="University or school name" />
          </Field>

          <Field label="Degree / Certificate">
            <Input value={item.degree || ''} onChange={e => set('degree', e.target.value)} placeholder="e.g. BSc in Computer Science" />
          </Field>

          <Field label="Date Range">
            <Input value={item.date || ''} onChange={e => set('date', e.target.value)} placeholder="e.g. 2018 - 2022" />
          </Field>

          <Field label="Grade / GPA">
            <Input value={item.grade || ''} onChange={e => set('grade', e.target.value)} placeholder="e.g. 3.75 CGPA" />
          </Field>

          <Field label="Institution Logo URL">
            <Input value={item.img || ''} onChange={e => set('img', e.target.value)} placeholder="https://university.edu/logo.png" />
            {item.img && <ImagePreview src={item.img} alt="Logo" onError={e => { e.target.style.display = 'none'; }} style={{ marginTop: 8 }} />}
          </Field>

          <Field label="Description (optional)">
            <Textarea rows={3} value={item.desc || ''} onChange={e => set('desc', e.target.value)} placeholder="Additional details..." />
          </Field>
        </ItemBody>
      )}
    </ItemCard>
  );
}

export default function EducationForm() {
  const { education, updateSection } = usePortfolio();
  const [items, setItems] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (education) setItems(JSON.parse(JSON.stringify(education))); }, [education]);

  const updateItem = (idx, updated) => setItems(arr => arr.map((it, i) => (i === idx ? updated : it)));
  const deleteItem = (idx) => setItems(arr => arr.filter((_, i) => i !== idx));
  const addItem = () => setItems(arr => [...arr, { id: Date.now(), img: '', school: '', degree: '', date: '', grade: '', desc: '' }]);

  const handleSave = () => {
    updateSection('education', items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <FormSection>
      <SectionTitle>Education</SectionTitle>

      <ItemList>
        {items.map((item, idx) => (
          <EducationItem
            key={item.id ?? idx}
            item={item}
            onUpdate={updated => updateItem(idx, updated)}
            onDelete={() => deleteItem(idx)}
          />
        ))}
      </ItemList>

      <AddItemButton type="button" onClick={addItem}>+ Add Education</AddItemButton>

      <Row>
        <SaveButton type="button" onClick={handleSave}>Save Education</SaveButton>
        {saved && <SavedBadge>✓ Saved!</SavedBadge>}
      </Row>
    </FormSection>
  );
}
