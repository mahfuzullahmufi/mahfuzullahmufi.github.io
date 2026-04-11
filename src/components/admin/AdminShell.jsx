import { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import BioForm from './BioForm';
import SkillsForm from './SkillsForm';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import ProjectsForm from './ProjectsForm';
import {
  AdminContainer, AdminHeader, AdminTitle, HeaderActions,
  ActionButton, TabBar, Tab, FormArea,
} from './AdminStyles';

const TABS = ['Bio', 'Skills', 'Experience', 'Education', 'Projects'];

export default function AdminShell({ onLogout }) {
  const [activeTab, setActiveTab] = useState('Bio');
  const { exportJSON, resetToDefault } = usePortfolio();

  const handleLogout = () => {
    sessionStorage.removeItem('admin-auth');
    onLogout();
  };

  const handleReset = () => {
    if (window.confirm('Reset all changes and reload from the original JSON file?')) {
      resetToDefault();
    }
  };

  return (
    <AdminContainer>
      <AdminHeader>
        <AdminTitle>Portfolio Admin</AdminTitle>
        <HeaderActions>
          <ActionButton onClick={exportJSON}>⬇ Export JSON</ActionButton>
          <ActionButton $variant="warning" onClick={handleReset}>↺ Reset to Default</ActionButton>
          <ActionButton $variant="danger" onClick={handleLogout}>Logout</ActionButton>
        </HeaderActions>
      </AdminHeader>

      <TabBar>
        {TABS.map(tab => (
          <Tab key={tab} $active={activeTab === tab} onClick={() => setActiveTab(tab)}>
            {tab}
          </Tab>
        ))}
      </TabBar>

      <FormArea>
        {activeTab === 'Bio'        && <BioForm />}
        {activeTab === 'Skills'     && <SkillsForm />}
        {activeTab === 'Experience' && <ExperienceForm />}
        {activeTab === 'Education'  && <EducationForm />}
        {activeTab === 'Projects'   && <ProjectsForm />}
      </FormArea>
    </AdminContainer>
  );
}
