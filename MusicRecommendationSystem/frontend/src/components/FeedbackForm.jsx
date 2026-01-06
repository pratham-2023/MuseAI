import React, { useState } from 'react';
import { Send, MessageSquare, Star } from 'lucide-react';

const FeedbackForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        rating: 0,
        message: ''
    });
    const [status, setStatus] = useState('');
    const [hoveredStar, setHoveredStar] = useState(0);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRating = (rating) => {
        setFormData({
            ...formData,
            rating
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const res = await fetch('http://localhost:5000/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', rating: 0, message: '' });
                setTimeout(() => setStatus(''), 3000);
            } else {
                console.error('Failed to submit feedback');
                setStatus('');
            }
        } catch (err) {
            console.error(err);
            setStatus('');
        }
    };

    return (
        <section className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={24} />
                User Feedback
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <label
                        htmlFor="name"
                        style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}
                    >
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '1rem'
                        }}
                    />
                </div>

                <div>
                    <label
                        style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}
                    >
                        Rating
                    </label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={32}
                                style={{
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    fill: (hoveredStar || formData.rating) >= star ? 'var(--accent)' : 'transparent',
                                    color: (hoveredStar || formData.rating) >= star ? 'var(--accent)' : 'rgba(255, 255, 255, 0.3)',
                                }}
                                onMouseEnter={() => setHoveredStar(star)}
                                onMouseLeave={() => setHoveredStar(0)}
                                onClick={() => handleRating(star)}
                            />
                        ))}
                        {formData.rating > 0 && (
                            <span style={{ marginLeft: '12px', color: 'var(--text-secondary)' }}>
                                {formData.rating} / 5
                            </span>
                        )}
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="message"
                        style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}
                    >
                        Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Tell us what you think..."
                        rows={4}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '1rem',
                            resize: 'vertical'
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === 'sending' || status === 'success'}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        background: status === 'success' ? '#10b981' : 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        cursor: status === 'sending' ? 'wait' : 'pointer',
                        fontWeight: '600',
                        marginTop: '8px',
                        transition: 'background 0.3s ease'
                    }}
                >
                    {status === 'sending' ? (
                        'Sending...'
                    ) : status === 'success' ? (
                        'Sent Successfully!'
                    ) : (
                        <>
                            <Send size={18} />
                            Submit Feedback
                        </>
                    )}
                </button>
            </form>
        </section>
    );
};

export default FeedbackForm;
