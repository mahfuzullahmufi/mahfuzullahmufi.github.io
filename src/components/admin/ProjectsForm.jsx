import { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  FormSection, SectionTitle, FieldWrapper, FieldLabel,
  Input, Textarea, Select, SaveButton, Row, TagList, Tag, RemoveBtn, AddBtn, AddItemButton,
  ItemList, ItemCard, ItemHeader, ItemHeaderLeft, ItemTitle, ItemSubtitle,
  ItemHeaderRight, ItemBody, DeleteBtn, CollapseIcon, SavedBadge, ImagePreview,
} from './AdminStyles';

const CATEGORIES = ['personal project', 'professional project', 'research paper'];

function Field({ label, children }) {
  return (
    <FieldWrapper>
      <FieldLabel>{label}</FieldLabel>
      {children}
    </FieldWrapper>
  );
}

function MemberRow({ member, onChange, onDelete }) {
  const set = (field, value) => onChange({ ...member, [field]: value });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
      <Row>
        <Input value={member.name || ''} onChange={e => set('name', e.target.value)} placeholder="Member name" style={{ flex: 1 }} />
        <DeleteBtn type="button" onClick={onDelete}>Remove</DeleteBtn>
      </Row>
      <Input value={member.img || ''} onChange={e => set('img', e.target.value)} placeholder="Profile image URL" />
      <Input value={member.github || ''} onChange={e => set('github', e.target.value)} placeholder="GitHub URL" />
      <Input value={member.linkedin || ''} onChange={e => set('linkedin', e.target.value)} placeholder="LinkedIn URL" />
    </div>
  );
}

function ProjectItem({ item, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false);
  const [newTag, setNewTag] = useState('');

  const set = (field, value) => onUpdate({ ...item, [field]: value });

  const addTag = () => {
    if (!newTag.trim()) return;
    set('tags', [...(item.tags || []), newTag.trim()]);
    setNewTag('');
  };

  const removeTag = (idx) => set('tags', item.tags.filter((_, i) => i !== idx));

  const addMember = () => set('member', [...(item.member || []), { name: '', img: '', github: '', linkedin: '' }]);
  const updateMember = (idx, updated) => set('member', item.member.map((m, i) => (i === idx ? updated : m)));
  const removeMember = (idx) => set('member', item.member.filter((_, i) => i !== idx));

  return (
    <ItemCard>
      <ItemHeader onClick={() => setOpen(o => !o)}>
        <ItemHeaderLeft>
          <ItemTitle>{item.title || 'New Project'}</ItemTitle>
          <ItemSubtitle style={{ textTransform: 'capitalize' }}>{item.category} {item.date ? `· ${item.date}` : ''}</ItemSubtitle>
        </ItemHeaderLeft>
        <ItemHeaderRight>
          <DeleteBtn type="button" onClick={e => { e.stopPropagation(); onDelete(); }}>Delete</DeleteBtn>
          <CollapseIcon $open={open}>▼</CollapseIcon>
        </ItemHeaderRight>
      </ItemHeader>

      {open && (
        <ItemBody>
          <Field label="Project Title">
            <Input value={item.title || ''} onChange={e => set('title', e.target.value)} placeholder="Project name" />
          </Field>

          <Field label="Date">
            <Input value={item.date || ''} onChange={e => set('date', e.target.value)} placeholder="e.g. January 2024 - Present" />
          </Field>

          <Field label="Category">
            <Select value={item.category || 'personal project'} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>

          <Field label="Description">
            <Textarea rows={4} value={item.description || ''} onChange={e => set('description', e.target.value)} placeholder="What is this project about?" />
          </Field>

          <Field label="Project Image URL">
            <Input value={item.image || ''} onChange={e => set('image', e.target.value)} placeholder="https://... or /images/projects/filename.png" />
            {item.image && <ImagePreview src={item.image} alt="Preview" onError={e => { e.target.style.display = 'none'; }} style={{ marginTop: 8 }} />}
          </Field>

          <Field label="Tags / Tech Stack">
            <TagList>
              {(item.tags || []).map((t, i) => (
                <Tag key={i}>{t}<RemoveBtn onClick={() => removeTag(i)}>×</RemoveBtn></Tag>
              ))}
            </TagList>
            <Row style={{ marginTop: 8 }}>
              <Input
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag..."
                style={{ flex: 1 }}
              />
              <AddBtn type="button" onClick={addTag}>+ Add</AddBtn>
            </Row>
          </Field>

          <Field label="GitHub URL">
            <Input value={item.github || ''} onChange={e => set('github', e.target.value)} placeholder="https://github.com/..." />
          </Field>

          <Field label="Live / Demo URL">
            <Input value={item.webapp || ''} onChange={e => set('webapp', e.target.value)} placeholder="https://..." />
          </Field>

          <FieldWrapper>
            <FieldLabel>Team Members (optional)</FieldLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(item.member || []).map((m, i) => (
                <MemberRow
                  key={i}
                  member={m}
                  onChange={updated => updateMember(i, updated)}
                  onDelete={() => removeMember(i)}
                />
              ))}
              <AddBtn type="button" onClick={addMember}>+ Add Member</AddBtn>
            </div>
          </FieldWrapper>
        </ItemBody>
      )}
    </ItemCard>
  );
}

export default function ProjectsForm() {
  const { projects, updateSection } = usePortfolio();
  const [items, setItems] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (projects) setItems(JSON.parse(JSON.stringify(projects))); }, [projects]);

  const updateItem = (idx, updated) => setItems(arr => arr.map((it, i) => (i === idx ? updated : it)));
  const deleteItem = (idx) => setItems(arr => arr.filter((_, i) => i !== idx));
  const addItem = () => setItems(arr => [...arr, { id: Date.now(), title: '', date: '', description: '', image: '', tags: [], category: 'personal project', github: '', webapp: '', member: [] }]);

  const handleSave = () => {
    updateSection('projects', items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <FormSection>
      <SectionTitle>Projects</SectionTitle>

      <ItemList>
        {items.map((item, idx) => (
          <ProjectItem
            key={item.id ?? idx}
            item={item}
            onUpdate={updated => updateItem(idx, updated)}
            onDelete={() => deleteItem(idx)}
          />
        ))}
      </ItemList>

      <AddItemButton type="button" onClick={addItem}>+ Add Project</AddItemButton>

      <Row>
        <SaveButton type="button" onClick={handleSave}>Save Projects</SaveButton>
        {saved && <SavedBadge>✓ Saved!</SavedBadge>}
      </Row>
    </FormSection>
  );
}
