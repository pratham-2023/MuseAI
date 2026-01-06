import React from 'react';
import FeedbackForm from '../components/FeedbackForm';
import { MessageSquare } from 'lucide-react';

const Feedback = () => {
    return (
        <div className="fade-in">
            <header style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                        padding: '12px',
                        background: 'var(--primary)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <MessageSquare size={28} />
                    </div>
                    <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Feedback</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    We'd love to hear your thoughts! Share your feedback, suggestions, or report any issues you've encountered.
                </p>
            </header>

            <FeedbackForm />
        </div>
    );
};

export default Feedback;
