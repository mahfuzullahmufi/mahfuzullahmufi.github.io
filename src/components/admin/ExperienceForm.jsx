import { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  FormSection, SectionTitle, FieldWrapper, FieldLabel,
  Input, Textarea, SaveButton, Row, TagList, Tag, RemoveBtn, AddBtn, AddItemButton,
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

function ExperienceItem({ item, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const set = (field, value) => onUpdate({ ...item, [field]: value });

  const addSkill = () => {
    if (!newSkill.trim()) return;
    set('skills', [...(item.skills || []), newSkill.trim()]);
    setNewSkill('');
  };

  const removeSkill = (idx) => set('skills', item.skills.filter((_, i) => i !== idx));

  return (
    <ItemCard>
      <ItemHeader onClick={() => setOpen(o => !o)}>
        <ItemHeaderLeft>
          <ItemTitle>{item.role || 'New Experience'}</ItemTitle>
          <ItemSubtitle>{item.company} {item.date ? `· ${item.date}` : ''}</ItemSubtitle>
        </ItemHeaderLeft>
        <ItemHeaderRight>
          <DeleteBtn type="button" onClick={e => { e.stopPropagation(); onDelete(); }}>Delete</DeleteBtn>
          <CollapseIcon $open={open}>▼</CollapseIcon>
        </ItemHeaderRight>
      </ItemHeader>

      {open && (
        <ItemBody>
          <Field label="Role / Job Title">
            <Input value={item.role || ''} onChange={e => set('role', e.target.value)} placeholder="e.g. Senior Software Engineer" />
          </Field>

          <Field label="Company">
            <Input value={item.company || ''} onChange={e => set('company', e.target.value)} placeholder="Company name" />
          </Field>

          <Field label="Date Range">
            <Input value={item.date || ''} onChange={e => set('date', e.target.value)} placeholder="e.g. Jan 2023 - Present" />
          </Field>

          <Field label="Company Logo URL">
            <Input value={item.img || ''} onChange={e => set('img', e.target.value)} placeholder="https://company.com/logo.png" />
            {item.img && <ImagePreview src={item.img} alt="Logo" onError={e => { e.target.style.display = 'none'; }} style={{ marginTop: 8 }} />}
          </Field>

          <Field label="Description">
            <Textarea rows={4} value={item.desc || ''} onChange={e => set('desc', e.target.value)} placeholder="What did you do?" />
          </Field>

          <Field label="Skills Used">
            <TagList>
              {(item.skills || []).map((s, i) => (
                <Tag key={i}>{s}<RemoveBtn onClick={() => removeSkill(i)}>×</RemoveBtn></Tag>
              ))}
            </TagList>
            <Row style={{ marginTop: 8 }}>
              <Input
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Add skill..."
                style={{ flex: 1 }}
              />
              <AddBtn type="button" onClick={addSkill}>+ Add</AddBtn>
            </Row>
          </Field>

          <Field label="Document / Certificate URL (optional)">
            <Input value={item.doc || ''} onChange={e => set('doc', e.target.value)} placeholder="https://..." />
          </Field>
        </ItemBody>
      )}
    </ItemCard>
  );
}

export default function ExperienceForm() {
  const { experiences, updateSection } = usePortfolio();
  const [items, setItems] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (experiences) setItems(JSON.parse(JSON.stringify(experiences))); }, [experiences]);

  const updateItem = (idx, updated) => setItems(arr => arr.map((it, i) => (i === idx ? updated : it)));
  const deleteItem = (idx) => setItems(arr => arr.filter((_, i) => i !== idx));
  const addItem = () => setItems(arr => [...arr, { id: Date.now(), img: '', role: '', company: '', date: '', desc: '', skills: [], doc: '' }]);

  const handleSave = () => {
    updateSection('experiences', items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <FormSection>
      <SectionTitle>Experience</SectionTitle>

      <ItemList>
        {items.map((item, idx) => (
          <ExperienceItem
            key={item.id ?? idx}
            item={item}
            onUpdate={updated => updateItem(idx, updated)}
            onDelete={() => deleteItem(idx)}
          />
        ))}
      </ItemList>

      <AddItemButton type="button" onClick={addItem}>+ Add Experience</AddItemButton>

      <Row>
        <SaveButton type="button" onClick={handleSave}>Save Experience</SaveButton>
        {saved && <SavedBadge>✓ Saved!</SavedBadge>}
      </Row>
    </FormSection>
  );
}
