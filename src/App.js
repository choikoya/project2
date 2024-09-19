import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/header'; // 헤더 컴포넌트
import Footer from './components/footer'; // 푸터 컴포넌트
import LoginPage from './login';
import Dashboard from './dashboard';
import AnalysisResult from './analysisResult'; // 분석결과 페이지 컴포넌트
import AdminPage from './adminPage';
import Notice from './notice';
import NoticeDetail from './noticeDetail';
import NoticeWrite from './noticeWrite';
import TimeTable from './timeTable';
import Graph from './graph';

function Layout({ children }) {
  const location = useLocation();

  // 로그인 페이지에서만 헤더와 푸터를 숨기기
  const isLoginPage = location.pathname === '/';

  return (
    <div className="app-container">
      {/* 로그인 페이지가 아닌 경우에만 헤더를 렌더링 */}
      {!isLoginPage && <Header />}
      <main className="main-content">{children}</main>
      {/* 로그인 페이지가 아닌 경우에만 푸터를 렌더링 */}
      {!isLoginPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path="/result" element={<AnalysisResult />} />
          <Route path="/adminPage" element={<AdminPage />} />
          <Route path="/notice" element={<Notice />} /> {/* 공지사항 목록 페이지 */}
          <Route path="/notice/:id" element={<NoticeDetail />} /> {/* 공지사항 상세 페이지 */}
          <Route path="/write" element={<NoticeWrite />} /> {/* 공지사항  페이지 */}
          <Route path="/timetable" element={<TimeTable />} />
          <Route path="/graph" element={<Graph />} />


        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
