import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/header'; // 헤더 컴포넌트
import Footer from './components/footer'; // 푸터 컴포넌트
import LoginPage from './login';
import Dashboard from './dashboard';
import FileUpload from './fileUpload'; // 파일 업로드 페이지 컴포넌트

function Layout({ children }) {
  const location = useLocation();

  // 로그인 페이지에서만 헤더와 푸터를 숨기기
  const isLoginPage = location.pathname === '/';

  return (
    <>
      {/* 로그인 페이지가 아닌 경우에만 헤더를 렌더링 */}
      {!isLoginPage && <Header />}
      <main>{children}</main>
      {/* 로그인 페이지가 아닌 경우에만 푸터를 렌더링 */}
      {!isLoginPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          {/* /<Route path='/dashboard' element={<Dashboard/>}/> */}
          <Route path="/upload" element={<FileUpload />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
