import React, { Component } from 'react';

class CardForm extends Component {
    render() {
        const { inpQ, inpA, editingCard, onQChange, onAChange, onSave } = this.props;

        return (
            <div id="formArea">
                <input 
                    value={inpQ} 
                    onChange={onQChange} 
                    placeholder="Enter question" 
                />
                <input 
                    value={inpA} 
                    onChange={onAChange} 
                    placeholder="Enter answer" 
                />
                <button onClick={onSave}>
                    {editingCard === 0 ? "Create" : "Edit"}
                </button>
            </div>
        );
    }
}

export default CardForm;
