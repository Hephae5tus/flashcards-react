import React, { Component } from 'react';
import CardForm from './CardForm';
import CardViewer from './CardViewer';
import DeckControls from './DeckControls';

class App extends Component {
    constructor(props) {
        super(props);
        let savedDecks = JSON.parse(localStorage.getItem('flashcards-decks') || '[]');
        
        let initialListId = 0;
        let initialCards = [];
        let initialCardId = 0;

        if (savedDecks.length > 0) {
            initialListId = savedDecks[0].id;
            initialCards = savedDecks[0].cards;
            if (initialCards.length > 0) {
                initialCardId = initialCards[0].id;
            }
        }

        this.state = {
            listOfLists: savedDecks,
            currentList: initialListId,
            flashCards: initialCards,
            currentCard: initialCardId,
            cardSide: 0,
            editingCard: 0,
            inpQ: "",
            inpA: "",
            alertText: ""
        };
    }

    componentDidUpdate() {
        localStorage.setItem('flashcards-decks', JSON.stringify(this.state.listOfLists));
    }

    handleQChange = (e) => {
        this.setState({ inpQ: e.target.value });
    }

    handleAChange = (e) => {
        this.setState({ inpA: e.target.value });
    }

    addFlashCard = () => {
        if (this.state.listOfLists.length === 0) {
            this.setState({ alertText: "CREATE A LIST!" });
            return;
        }
        if (this.state.editingCard !== 0) {
            this.confirmEditing(this.state.editingCard);
            return;
        }
        if (this.state.inpQ !== "" || this.state.inpA !== "") {
            const newCard = { 
                id: Date.now(), 
                question: this.state.inpQ, 
                answer: this.state.inpA, 
                completed: false 
            };
            
            const newLists = [...this.state.listOfLists];
            for (let i = 0; i < newLists.length; i++) {
                if (newLists[i].id === this.state.currentList) {
                    newLists[i].cards.push(newCard);
                    this.setState({ 
                        flashCards: newLists[i].cards, 
                        listOfLists: newLists, 
                        inpQ: "", 
                        inpA: "",
                        currentCard: newLists[i].cards.length === 1 ? newCard.id : this.state.currentCard,
                        alertText: ""
                    });
                }
            }
        }
    }

    confirmEditing = (id) => {
        const newLists = [...this.state.listOfLists];
        for (let i = 0; i < newLists.length; i++) {
            for (let j = 0; j < newLists[i].cards.length; j++) {
                if (newLists[i].cards[j].id === id) {
                    newLists[i].cards[j].question = this.state.inpQ;
                    newLists[i].cards[j].answer = this.state.inpA;
                }
            }
        }

        let currentCards = [];
        for (let i = 0; i < newLists.length; i++) {
            if (newLists[i].id === this.state.currentList) {
                currentCards = newLists[i].cards;
            }
        }

        this.setState({ 
            listOfLists: newLists, 
            flashCards: currentCards,
            editingCard: 0, 
            inpQ: "", 
            inpA: "" 
        });
    }

    deleteCard = (id) => {
        this.nextCard();
        const newLists = [...this.state.listOfLists];
        for (let i = 0; i < newLists.length; i++) {
            if (newLists[i].id === this.state.currentList) {
                let filtered = [];
                for (let j = 0; j < newLists[i].cards.length; j++) {
                    if (newLists[i].cards[j].id !== id) filtered.push(newLists[i].cards[j]);
                }
                newLists[i].cards = filtered;
                this.setState({ listOfLists: newLists, flashCards: filtered });
            }
        }
    }

    nextCard = () => {
        if (this.state.cardSide === 1) this.setState({ cardSide: 0 });
        const cards = this.state.flashCards;
        let idx = -1;
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].id === this.state.currentCard) {
                idx = i;
                break;
            }
        }

        for (let i = idx + 1; i < cards.length; i++) {
            if (cards[i].completed === false) { 
                this.setState({ currentCard: cards[i].id }); 
                return; 
            }
        }
        for (let i = 0; i <= idx; i++) {
            if (cards[i].completed === false) { 
                this.setState({ currentCard: cards[i].id }); 
                return; 
            }
        }
    }

    prevCard = () => {
        if (this.state.cardSide === 1) this.setState({ cardSide: 0 });
        const cards = this.state.flashCards;
        let idx = -1;
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].id === this.state.currentCard) {
                idx = i;
                break;
            }
        }

        for (let i = idx - 1; i >= 0; i--) {
            if (cards[i].completed === false) { 
                this.setState({ currentCard: cards[i].id }); 
                return; 
            }
        }
        for (let i = cards.length - 1; i >= idx; i--) {
            if (cards[i].completed === false) { 
                this.setState({ currentCard: cards[i].id }); 
                return; 
            }
        }
    }

    mixCards = () => {
        let cards = [...this.state.flashCards];
        for (let i = cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = cards[i];
            cards[i] = cards[j];
            cards[j] = temp;
        }
        const newLists = [...this.state.listOfLists];
        for (let i = 0; i < newLists.length; i++) {
            if (newLists[i].id === this.state.currentList) newLists[i].cards = cards;
        }
        this.setState({ flashCards: cards, listOfLists: newLists });
    }

    addList = () => {
        const newList = { id: Date.now(), cards: [] };
        this.setState({
            listOfLists: [...this.state.listOfLists, newList],
            currentList: newList.id,
            flashCards: [],
            currentCard: 0,
            alertText: ""
        });
    }

    deleteList = () => {
        let newList = [];
        for (let i = 0; i < this.state.listOfLists.length; i++) {
            if (this.state.listOfLists[i].id !== this.state.currentList) newList.push(this.state.listOfLists[i]);
        }
        this.setState({
            listOfLists: newList,
            currentList: newList.length > 0 ? newList[0].id : 0,
            flashCards: newList.length > 0 ? newList[0].cards : [],
            currentCard: (newList.length > 0 && newList[0].cards.length > 0) ? newList[0].cards[0].id : 0
        });
    }

    nextList = () => {
        const lists = this.state.listOfLists;
        let idx = -1;
        for (let i = 0; i < lists.length; i++) {
            if (lists[i].id === this.state.currentList) {
                idx = i;
                break;
            }
        }
        let nextIdx = (idx + 1 === lists.length) ? 0 : idx + 1;
        const nextList = lists[nextIdx];
        this.setState({ 
            currentList: nextList.id, 
            flashCards: nextList.cards,
            currentCard: nextList.cards.length > 0 ? nextList.cards[0].id : 0,
            cardSide: 0, editingCard: 0
        });
    }

    prevList = () => {
        const lists = this.state.listOfLists;
        let idx = -1;
        for (let i = 0; i < lists.length; i++) {
            if (lists[i].id === this.state.currentList) {
                idx = i;
                break;
            }
        }
        let prevIdx = (idx === 0) ? lists.length - 1 : idx - 1;
        const nextList = lists[prevIdx];
        this.setState({ 
            currentList: nextList.id, 
            flashCards: nextList.cards,
            currentCard: nextList.cards.length > 0 ? nextList.cards[0].id : 0,
            cardSide: 0, editingCard: 0
        });
    }

    render() {
        let currentCardObj = null;
        for (let i = 0; i < this.state.flashCards.length; i++) {
            if (this.state.flashCards[i].id === this.state.currentCard) {
                currentCardObj = this.state.flashCards[i];
            }
        }

        const rows = this.state.flashCards.map(c => (
            <tr key={c.id}>
                <td>{c.question}</td>
                <td>{c.answer}</td>
                <td onClick={() => {
                    const newLists = JSON.parse(JSON.stringify(this.state.listOfLists));
                    let updatedCards = [];
                    for (let i = 0; i < newLists.length; i++) {
                        if (newLists[i].id === this.state.currentList) {
                            for (let j = 0; j < newLists[i].cards.length; j++) {
                                if (newLists[i].cards[j].id === c.id) {
                                    newLists[i].cards[j].completed = !newLists[i].cards[j].completed;
                                }
                            }
                            updatedCards = newLists[i].cards;
                        }
                    }
                    this.setState({ listOfLists: newLists, flashCards: updatedCards });
                }} style={{ cursor: 'pointer' }}>
                    {c.completed ? "DONE" : "UNDONE"}
                </td>
                <td onClick={() => this.deleteCard(c.id)} style={{ cursor: 'pointer', color: 'red' }}>DELETE</td>
                <td onClick={() => this.setState({ editingCard: c.id, inpQ: c.question, inpA: c.answer })} style={{ cursor: 'pointer' }}>
                    {this.state.editingCard === c.id ? "EDITING" : "EDIT"}
                </td>
            </tr>
        ));

        return (
            <div id="container" >
                <h1>Flashcards</h1>
                
                <CardForm 
                    inpQ={this.state.inpQ} 
                    inpA={this.state.inpA} 
                    editingCard={this.state.editingCard}
                    onQChange={this.handleQChange}
                    onAChange={this.handleAChange}
                    onSave={this.addFlashCard}
                />

                <div style={{ color: 'red' }}>{this.state.alertText}</div>

                <CardViewer 
                    card={currentCardObj}
                    side={this.state.cardSide}
                    onFlip={() => this.setState({ cardSide: this.state.cardSide === 0 ? 1 : 0 })}
                    onNext={this.nextCard}
                    onPrev={this.prevCard}
                />

                <DeckControls 
                    onPrevList={this.prevList}
                    onNextList={this.nextList}
                    onAddList={this.addList}
                    onDeleteList={this.deleteList}
                    onMix={this.mixCards}
                />

                <table border="1" style={{ marginTop: '20px', width: '100%' }}>
                    <thead>
                        <tr><th>Q</th><th>A</th><th>Status</th><th>Del</th><th>Edit</th></tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            </div>
        );
    }
}

export default App;
