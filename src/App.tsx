import Navbar from "./components/Navbar.tsx";
import About from "./components/About.tsx";
import Projects from "./components/Projects.tsx";
import Skills from "./components/Skills.tsx";
import Contact from "./components/Contact.tsx";
import ChatBox from "./components/ChatBox";
import MessagesContextProvider from "./context/messagesContext.tsx";

const App = () => {
  return (
    <div className="text-gray-400 bg-gray-900 body-font">
      <MessagesContextProvider>
        <ChatBox />
      </MessagesContextProvider>
      <Navbar />
      <About />
      <Projects />
      <Skills />
      <Contact />
    </div>
  );
};

export default App;
