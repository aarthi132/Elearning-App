import React, { useState } from 'react';
import axios from 'axios';
import './CodeEditor.css';

const CodeEditor = ({ onClose, defaultLanguage = 'python' }) => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState(defaultLanguage);
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const getPlaceholder = (lang) => {
        if (lang === 'python') return `Write your Python code here...\n\nExample:\nprint("Hello World!")`;
        if (lang === 'javascript') return `Write your JavaScript code here...\n\nExample:\nconsole.log("Hello World!");`;
        if (lang === 'sql') return `Write your SQL queries here...\n\nExample:\nSELECT * FROM students;\n\n-- Available tables: students (id, name, course), courses (id, title, price)`;
        if (lang === 'cpp') return `Write your C++ code here...\n\nExample:\n#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello World!";\n  return 0;\n}`;
        if (lang === 'java') return `Write your Java code here...\n\nExample:\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World!");\n  }\n}`;
        return `Write your ${lang} code here...`;
    };

    const handleRunCode = async () => {
        if (!code.trim()) {
            setError('Please enter some code to run.');
            return;
        }

        setIsLoading(true);
        setError('');
        setOutput('Executing...');

        try {
            const response = await axios.post('http://localhost:3001/execute', {
                language,
                code
            });

            if (response.data.error) {
                setError(response.data.error);
                setOutput('');
            } else {
                setOutput(response.data.output || 'No output produced.');
            }
        } catch (err) {
            console.error(err);
            setError('Error connecting to the execution server.');
            setOutput('');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="code-editor-modal-overlay">
            <div className="code-editor-modal">
                <div className="editor-header">
                    <div className="editor-title">
                        👨‍💻 Live Code Editor
                    </div>
                    <button className="close-editor-btn" onClick={onClose}>✖</button>
                </div>

                <div className="editor-controls">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="language-selector"
                    >
                        <option value="python">Python 3</option>
                        <option value="javascript">JavaScript (Node.js)</option>
                        <option value="sql">SQL</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                    </select>

                    <button
                        className="btn-run-code"
                        onClick={handleRunCode}
                        disabled={isLoading}
                    >
                        {isLoading ? '⏳ Running...' : '▶ Run Code'}
                    </button>
                </div>

                <div className="editor-body">
                    <textarea
                        className="code-textarea"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder={getPlaceholder(language)}
                        spellCheck="false"
                    />
                </div>

                <div className="editor-footer">
                    <h4>Output</h4>
                    <div className={`output-console ${error ? 'has-error' : ''}`}>
                        {error ? (
                            <pre className="error-text">❌ {error}</pre>
                        ) : (
                            <pre>{output}</pre>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;
