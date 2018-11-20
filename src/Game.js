import React, { Component } from 'react';
import './game.css'

class Square extends Component {
    render() {
        return (
            <div className="square">

            </div>
        )
    }
}

class PlayerField extends Component {
    render() {

        let squares = []
        for (let i = 0; i < 90; i++) {
            squares.push(<Square />)
        }

        return (
            <section className="player">
                <h1>Player</h1>
                <div className="game_area">
                    {squares}
                </div>
            </section>
        )
    }
}

class NpcField extends Component {
    render() {

        let squares = []
        for (let i = 0; i < 90; i++) {
            squares.push(<Square />)
        }

        return (
            <section className="npc">
                <h1>NPC</h1>
                <div className="game_area">
                    {squares}
                </div>
            </section>
        )
    }
}

export default class Game extends Component {

    constructor(props) {
        super(props)
        this.state = {
            started: false,
            turn: 0,
            ready: false
        }
    }

    render() {

        let info

        this.state.started ? info = (<div>test</div>)
            : info = (
            <div className="not_ready">
                <button disabled={!this.state.ready} className="start">Start Game</button>
                
            </div>
            )

        return (
            <div className="game">
                <NpcField />
                <section className="info">
                    {info}
                </section>
                <PlayerField />
            </div>
        );
    }
}