import React from 'react';
import './BlockRating.css';

const BlockRating = ({ blockId, averageRating, ratingsCount, userRating, onRate }) => {
    const [hoveredStar, setHoveredStar] = React.useState(0);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleRate = async (stars) => {
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:8000/api/ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ blockId, stars })
            });

            if (response.ok && onRate) {
                onRate();
            }
        } catch (error) {
            console.error('Erreur notation:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = () => {
        return [1, 2, 3, 4, 5].map(star => {
            const filled = (hoveredStar || userRating || 0) >= star;
            return (
                <span
                    key={star}
                    className={`star ${filled ? 'filled' : ''}`}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => handleRate(star)}
                >
                    ★
                </span>
            );
        });
    };

    return (
        <div className="block-rating">
            <div className="stars-container">
                {renderStars()}
            </div>
            {averageRating > 0 && (
                <div className="rating-info">
                    <span className="average">{averageRating.toFixed(1)}</span>
                    <span className="count">({ratingsCount} {ratingsCount > 1 ? 'votes' : 'vote'})</span>
                </div>
            )}
        </div>
    );
};

export default BlockRating;
