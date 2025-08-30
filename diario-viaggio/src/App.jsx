// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PostForm from "./pages/PostForm";
import PostCard from "./pages/PostCard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/form" element={<PostForm />} />
        <Route path="/post/:id" element={<PostCard />} />
      </Routes>
    </Router>
  );
}

export default App;
