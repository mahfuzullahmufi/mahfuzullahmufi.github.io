import { ThemeProvider } from "styled-components";
import { useState } from "react";
import { darkTheme, lightTheme } from './utils/Themes.js'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from "styled-components";
import './App.css';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Experience from "./components/Experience";
import Education from "./components/Education";
import ProjectDetails from "./components/ProjectDetails";
import AdminPage from "./pages/AdminPage";

const Body = styled.div`
  background-color: ${({ theme }) => theme.bg};
  width: 100%;
  overflow-x: hidden;
`

const Wrapper = styled.div`
  background: linear-gradient(38.73deg, rgba(204, 0, 187, 0.15) 0%, rgba(201, 32, 184, 0) 50%), linear-gradient(141.27deg, rgba(0, 70, 209, 0) 50%, rgba(0, 70, 209, 0.15) 100%);
  width: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 100%,30% 98%, 0 100%);
`

const LoadingScreen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  font-size: 1.2rem;
  letter-spacing: 0.05em;
`

function PortfolioHome({ openModal, setOpenModal }) {
  return (
    <>
      <Navbar />
      <Body>
        <HeroSection />
        <Wrapper>
          <Skills />
          <Experience />
        </Wrapper>
        <Projects openModal={openModal} setOpenModal={setOpenModal} />
        <Wrapper>
          <Education />
          <Contact />
        </Wrapper>
        <Footer />
        {openModal.state &&
          <ProjectDetails openModal={openModal} setOpenModal={setOpenModal} />
        }
      </Body>
    </>
  );
}

function AppContent() {
  const [darkMode] = useState(true);
  const [openModal, setOpenModal] = useState({ state: false, project: null });
  const { loading } = usePortfolio();

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      {loading ? (
        <LoadingScreen>Loading…</LoadingScreen>
      ) : (
        <Routes>
          <Route path="/" element={<PortfolioHome openModal={openModal} setOpenModal={setOpenModal} />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      )}
    </ThemeProvider>
  );
}

function App() {
  return (
    <PortfolioProvider>
      <Router>
        <AppContent />
      </Router>
    </PortfolioProvider>
  );
}

export default App;
