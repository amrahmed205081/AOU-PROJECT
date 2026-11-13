import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './components/layout/SiteLayout.tsx'

const HomePage = lazy(() => import('./pages/HomePage.tsx').then((module) => ({ default: module.HomePage })))
const CategoryPage = lazy(() => import('./pages/CategoryPage.tsx').then((module) => ({ default: module.CategoryPage })))
const ArticlePage = lazy(() => import('./pages/ArticlePage.tsx').then((module) => ({ default: module.ArticlePage })))
const AboutPage = lazy(() => import('./pages/AboutPage.tsx').then((module) => ({ default: module.AboutPage })))
const ContactPage = lazy(() => import('./pages/ContactPage.tsx').then((module) => ({ default: module.ContactPage })))
const ContributePage = lazy(() => import('./pages/ContributePage.tsx').then((module) => ({ default: module.ContributePage })))
const SearchPage = lazy(() => import('./pages/SearchPage.tsx').then((module) => ({ default: module.SearchPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.tsx').then((module) => ({ default: module.NotFoundPage })))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="article/:slug" element={<ArticlePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="contribute" element={<ContributePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
