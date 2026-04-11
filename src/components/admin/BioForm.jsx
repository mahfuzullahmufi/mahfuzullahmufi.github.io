import { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  FormSection, SectionTitle, FieldWrapper, FieldLabel,
  Input, Textarea, SaveButton, Row, TagList, Tag, RemoveBtn, AddBtn, SavedBadge,
} from './AdminStyles';

function Field({ label, children }) {
  return (
    <FieldWrapper>
      <FieldLabel>{label}</FieldLabel>
      {children}
    </FieldWrapper>
  );
}

export default function BioForm() {
  const { bio, updateSection } = usePortfolio();
  const [form, setForm] = useState({ name: '', roles: [], description: '', github: '', resume: '', linkedin: '', twitter: '', insta: '', facebook: '' });
  const [newRole, setNewRole] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (bio) setForm(bio); }, [bio]);

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const addRole = () => {
    if (!newRole.trim()) return;
    set('roles', [...(form.roles || []), newRole.trim()]);
    setNewRole('');
  };

  const removeRole = (i) => set('roles', form.roles.filter((_, idx) => idx !== i));

  const handleSave = () => {
    updateSection('bio', form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <FormSection>
      <SectionTitle>Bio</SectionTitle>

      <Field label="Full Name">
        <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" />
      </Field>

      <Field label="Roles / Titles">
        <TagList>
          {(form.roles || []).map((r, i) => (
            <Tag key={i}>{r}<RemoveBtn onClick={() => removeRole(i)}>×</RemoveBtn></Tag>
          ))}
        </TagList>
        <Row>
          <Input
            value={newRole}
            onChange={e => setNewRole(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addRole())}
            placeholder="e.g. Full Stack Developer"
            style={{ flex: 1 }}
          />
          <AddBtn type="button" onClick={addRole}>+ Add</AddBtn>
        </Row>
      </Field>

      <Field label="Description">
        <Textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Short bio / about me" />
      </Field>

      <Field label="GitHub URL">
        <Input value={form.github} onChange={e => set('github', e.target.value)} placeholder="https://github.com/username" />
      </Field>

      <Field label="Resume URL">
        <Input value={form.resume} onChange={e => set('resume', e.target.value)} placeholder="https://drive.google.com/..." />
      </Field>

      <Field label="LinkedIn URL">
        <Input value={form.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="https://linkedin.com/in/username" />
      </Field>

      <Field label="Twitter URL">
        <Input value={form.twitter} onChange={e => set('twitter', e.target.value)} placeholder="https://twitter.com/username" />
      </Field>

      <Field label="Instagram URL">
        <Input value={form.insta} onChange={e => set('insta', e.target.value)} placeholder="https://instagram.com/username" />
      </Field>

      <Field label="Facebook URL">
        <Input value={form.facebook} onChange={e => set('facebook', e.target.value)} placeholder="https://facebook.com/username" />
      </Field>

      <Row>
        <SaveButton type="button" onClick={handleSave}>Save Bio</SaveButton>
        {saved && <SavedBadge>✓ Saved!</SavedBadge>}
      </Row>
    </FormSection>
  );
}
