import styled, { createGlobalStyle } from 'styled-components';

// Admin panel has its own self-contained dark theme
const C = {
  bg: '#0f0f1a',
  surface: '#1a1a2e',
  surfaceHover: '#22223a',
  border: '#2a2a4a',
  primary: '#854CE6',
  primaryHover: '#6b37cc',
  text: '#e0e0f0',
  textMuted: '#888',
  success: '#4caf50',
  danger: '#e53935',
  warning: '#fb8c00',
  inputBg: '#12121f',
};

export const AdminGlobal = createGlobalStyle`
  .admin-root, .admin-root * { box-sizing: border-box; }
  .admin-root { font-family: 'Poppins', 'Inter', sans-serif; }
`;

/* ── Layout ── */
export const AdminContainer = styled.div`
  min-height: 100vh;
  background: ${C.bg};
  color: ${C.text};
  font-family: 'Poppins', 'Inter', sans-serif;
`;

export const AdminHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 28px;
  background: ${C.surface};
  border-bottom: 1px solid ${C.border};
  position: sticky;
  top: 0;
  z-index: 100;
`;

export const AdminTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: ${C.text};
  margin: 0;
  letter-spacing: 0.3px;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

export const ActionButton = styled.button`
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid ${({ $variant }) =>
    $variant === 'danger' ? C.danger :
    $variant === 'warning' ? C.warning :
    C.primary};
  background: transparent;
  color: ${({ $variant }) =>
    $variant === 'danger' ? C.danger :
    $variant === 'warning' ? C.warning :
    C.primary};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: ${({ $variant }) =>
      $variant === 'danger' ? C.danger :
      $variant === 'warning' ? C.warning :
      C.primary};
    color: #fff;
  }
`;

export const TabBar = styled.div`
  display: flex;
  gap: 0;
  background: ${C.surface};
  border-bottom: 1px solid ${C.border};
  padding: 0 28px;
  overflow-x: auto;
`;

export const Tab = styled.button`
  padding: 14px 22px;
  background: none;
  border: none;
  border-bottom: 3px solid ${({ $active }) => ($active ? C.primary : 'transparent')};
  color: ${({ $active }) => ($active ? C.primary : C.textMuted)};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  &:hover { color: ${C.primary}; }
`;

export const FormArea = styled.div`
  padding: 32px 28px;
  max-width: 900px;
`;

/* ── Form Sections ── */
export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${C.text};
  margin: 0 0 4px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid ${C.border};
`;

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const FieldLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${C.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Input = styled.input`
  background: ${C.inputBg};
  border: 1px solid ${C.border};
  border-radius: 8px;
  color: ${C.text};
  font-size: 14px;
  padding: 10px 14px;
  outline: none;
  transition: border 0.2s;
  width: 100%;
  &:focus { border-color: ${C.primary}; }
  &::placeholder { color: ${C.textMuted}; }
`;

export const Textarea = styled.textarea`
  background: ${C.inputBg};
  border: 1px solid ${C.border};
  border-radius: 8px;
  color: ${C.text};
  font-size: 14px;
  padding: 10px 14px;
  outline: none;
  resize: vertical;
  transition: border 0.2s;
  width: 100%;
  font-family: inherit;
  &:focus { border-color: ${C.primary}; }
  &::placeholder { color: ${C.textMuted}; }
`;

export const Select = styled.select`
  background: ${C.inputBg};
  border: 1px solid ${C.border};
  border-radius: 8px;
  color: ${C.text};
  font-size: 14px;
  padding: 10px 14px;
  outline: none;
  width: 100%;
  cursor: pointer;
  &:focus { border-color: ${C.primary}; }
  option { background: ${C.surface}; }
`;

export const SaveButton = styled.button`
  align-self: flex-start;
  padding: 10px 28px;
  background: ${C.primary};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: ${C.primaryHover}; }
`;

export const Row = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

/* ── Tags / Chips ── */
export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 32px;
`;

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${C.primary}22;
  color: ${C.primary};
  border: 1px solid ${C.primary}55;
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
`;

export const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  line-height: 1;
  opacity: 0.7;
  &:hover { opacity: 1; }
`;

export const AddBtn = styled.button`
  padding: 8px 14px;
  background: ${C.primary}22;
  border: 1px solid ${C.primary};
  border-radius: 8px;
  color: ${C.primary};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
  &:hover { background: ${C.primary}44; }
`;

/* ── Item Cards (experience, education, project, skill category) ── */
export const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ItemCard = styled.div`
  background: ${C.surface};
  border: 1px solid ${C.border};
  border-radius: 12px;
  overflow: hidden;
`;

export const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  cursor: pointer;
  user-select: none;
  &:hover { background: ${C.surfaceHover}; }
`;

export const ItemHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const ItemTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${C.text};
`;

export const ItemSubtitle = styled.div`
  font-size: 12px;
  color: ${C.textMuted};
`;

export const ItemHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ItemBody = styled.div`
  padding: 18px;
  border-top: 1px solid ${C.border};
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const DeleteBtn = styled.button`
  padding: 5px 12px;
  background: transparent;
  border: 1px solid ${C.danger};
  border-radius: 6px;
  color: ${C.danger};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: ${C.danger}; color: #fff; }
`;

export const AddItemButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  background: ${C.surface};
  border: 1px dashed ${C.border};
  border-radius: 12px;
  color: ${C.textMuted};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  justify-content: center;
  &:hover { border-color: ${C.primary}; color: ${C.primary}; }
`;

export const CollapseIcon = styled.span`
  font-size: 12px;
  color: ${C.textMuted};
  transition: transform 0.2s;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0deg)')};
  display: inline-block;
`;

export const SavedBadge = styled.span`
  font-size: 12px;
  color: ${C.success};
  font-weight: 600;
`;

export const ImagePreview = styled.img`
  max-height: 80px;
  max-width: 180px;
  border-radius: 6px;
  border: 1px solid ${C.border};
  object-fit: contain;
  background: ${C.inputBg};
  padding: 4px;
`;

/* ── Login ── */
export const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${C.bg};
`;

export const LoginCard = styled.div`
  background: ${C.surface};
  border: 1px solid ${C.border};
  border-radius: 16px;
  padding: 40px 36px;
  width: 360px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const LoginTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: ${C.text};
  text-align: center;
`;

export const LoginSubtitle = styled.p`
  margin: -10px 0 0;
  font-size: 13px;
  color: ${C.textMuted};
  text-align: center;
`;

export const LoginButton = styled.button`
  width: 100%;
  padding: 12px;
  background: ${C.primary};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: ${C.primaryHover}; }
`;

export const ErrorText = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${C.danger};
  text-align: center;
`;

export const Divider = styled.div`
  height: 1px;
  background: ${C.border};
  margin: 4px 0;
`;
