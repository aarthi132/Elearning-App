import React from 'react';
import './PdfViewer.css';

function PdfViewer({ pdfUrl, courseTitle, onClose }) {

    const handleDownload = () => {
        const backendDownloadUrl = `http://localhost:3001/download-pdf?url=${encodeURIComponent(pdfUrl)}&filename=${encodeURIComponent(courseTitle || 'notes')}`;
        window.open(backendDownloadUrl, '_blank');
    };

    return (
        <div className="pdf-overlay" onClick={(e) => { if (e.target.className === 'pdf-overlay') onClose(); }}>
            <div className="pdf-modal">
                {/* Header */}
                <div className="pdf-modal-header">
                    <div className="pdf-modal-title">
                        <span className="pdf-icon">📄</span>
                        <span>{courseTitle ? `${courseTitle} - Notes` : 'Course Notes'}</span>
                    </div>
                    <div className="pdf-modal-actions">
                        <button className="pdf-btn-download" onClick={handleDownload}>
                            ⬇️ Download
                        </button>
                        <button className="pdf-btn-close" onClick={onClose}>
                            ✕
                        </button>
                    </div>
                </div>

                {/* PDF Viewer */}
                <div className="pdf-modal-body">
                    <iframe
                        src={pdfUrl}
                        title={`${courseTitle} Notes`}
                        className="pdf-iframe"
                        type="application/pdf"
                    />
                </div>
            </div>
        </div>
    );
}

export default PdfViewer;
