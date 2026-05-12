import React, { Component } from 'react';

class CardViewer extends Component {
    render() {
        const { card, side, onFlip, onNext, onPrev } = this.props;
        
        let cardText = "LIST IS EMPTY";
        if (card) {
            cardText = side === 0 ? card.question : card.answer;
        }

        return (
            <div style={{ display: 'flex', gap: '10px', margin: '20px 0', alignItems: 'center' }}>
                <button onClick={onPrev}>&lt;</button>
                <div 
                    onClick={onFlip} 
                    style={{ border: '1px solid black', padding: '20px', minWidth: '200px', textAlign: 'center', cursor: 'pointer' }}
                >
                    {cardText}
                </div>
                <button onClick={onNext}>&gt;</button>
            </div>
        );
    }
}

export default CardViewer;
