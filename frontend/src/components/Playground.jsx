import { useState } from 'react';
import '../styles/Playground.css';
import { PiPaperclip, PiMicrophone, PiArrowUp, PiShootingStar } from 'react-icons/pi';
import CustomDropdown from './CustomDropDown.jsx'; // 1. Import the new component (fixed casing)

const Playground = () => {
    const [prompt, setPrompt] = useState('');
    const [title, setTitle] = useState('');
    // 2. Change state to hold an object for the dropdown
    const [type, setType] = useState({ value: 'blog', label: 'Blog Post' });
    const [generatedPost, setGeneratedPost] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 3. Define the options for the dropdown
    const contentOptions = [
        { value: 'blog', label: 'Blog Post' },
        { value: 'tweet', label: 'Tweet' },
        { value: 'email', label: 'Email' },
        { value: 'article', label: 'Article' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!prompt || !title) return;
        
        // Use type.value when submitting
        console.log({ prompt, title, type: type.value });
        setIsLoading(true);
        setGeneratedPost('');

        setTimeout(() => {
            setGeneratedPost(`This is a generated ${type.label} about "${title}". The core idea is: "${prompt}". In a real application, this text would come from an AI model like Gemini, based on the provided inputs. It would be much longer and more detailed, following the instructions precisely to create high-quality content ready for use.`);
            setIsLoading(false);
        }, 2000);
    };

    const handleSave = () => {
        console.log('Post saved:', generatedPost);
    };

    return (
        <div className="playground-container">
            <div className="playground-content">
                <header className="playground-header">
                    <div className="logo"><PiShootingStar /></div>
                    <h1>Hi, I'm Zap.</h1>
                    <p>How can I help you today?</p>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="input-card glass-card">
                        <textarea
                            className="prompt-textarea"
                            placeholder="Ask anything..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <div className="input-controls">
                             <button type="button" className="icon-btn" aria-label="Attach file">
                                <PiPaperclip size={22} />
                            </button>
                            <div className="control-group">
                                {/* 4. Replace <select> with <CustomDropdown> */}
                                <CustomDropdown
                                    options={contentOptions}
                                    selectedValue={type.label}
                                    onChange={setType}
                                />
                                <input
                                    type="text"
                                    className="playground-input"
                                    placeholder="Enter title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <button type="button" className="icon-btn" aria-label="Use voice input">
                                <PiMicrophone size={22} />
                            </button>
                            <button type="submit" className="icon-btn submit-btn" aria-label="Submit prompt" disabled={isLoading}>
                                <PiArrowUp size={24} />
                            </button>
                        </div>
                    </div>
                </form>

                <div className="output-card glass-card">
                    <div className="output-content">
                        {isLoading 
                            ? <p className="output-placeholder">Generating...</p>
                            : generatedPost 
                                ? generatedPost 
                                : <p className="output-placeholder">Generated post will appear here</p>
                        }
                    </div>
                    <div className="output-actions">
                        {generatedPost && !isLoading && (
                            <button className="save-btn" onClick={handleSave}>
                                Save
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Playground;