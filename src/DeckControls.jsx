import React, { Component } from 'react';

class DeckControls extends Component {
    render() {
        const { onPrevList, onNextList, onAddList, onDeleteList, onMix } = this.props;
        
        return (
            <div style={{ marginTop: '20px' }}>
                <h3>Lists Control</h3>
                <button onClick={onPrevList}>&lt;</button>
                <button onClick={onAddList} style={{ margin: '0 10px' }}>New List</button>
                <button onClick={onMix}>Mix Cards</button>
                <button onClick={onDeleteList} style={{ margin: '0 10px', color: 'red' }}>Delete List</button>
                <button onClick={onNextList}>&gt;</button>
            </div>
        );
    }
}

export default DeckControls;
