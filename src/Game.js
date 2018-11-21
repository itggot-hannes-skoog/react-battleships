import React, { Component } from 'react';
import './game.css'

class Square extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="square"
                onClick={this.props.handleClick}
                onMouseEnter={this.props.handleHover}
                onMouseLeave={this.props.handleLeaveHover}
                index={this.props.datakey}>
            </div>
        )
    }
}

class PlayerField extends Component {

    render() {

        let squares = []
        for (let i = 0; i < 90; i++) {
            squares.push(<Square handleClick={this.props.handleClick} key={i} datakey={i} handleHover={this.props.handleHover} handleLeaveHover={this.props.handleLeaveHover} />)
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

    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick = (e) => {
        e.stopPropagation()
        console.log(e)
    }

    render() {

        let squares = []
        for (let i = 0; i < 90; i++) {
            squares.push(<Square key={i} />)
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
            ready: false,
            currentShip: 0,
            playerMatrix: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ],
            ships:
                [
                    {
                        name: 'Carrier',
                        size: 5,
                        rotation: 'horizontal',
                        placed: false
                    },
                    {
                        name: 'Battleship',
                        size: 4,
                        rotation: 'horizontal',
                        placed: false
                    },
                    {
                        name: 'Cruiser',
                        size: 3,
                        rotation: 'horizontal',
                        placed: false
                    },
                    {
                        name: 'Submarine',
                        size: 3,
                        rotation: 'horizontal',
                        placed: false
                    },
                    {
                        name: 'Destroyer',
                        size: 2,
                        rotation: 'horizontal',
                        placed: false
                    }
                ]
        }
        this.startPlacement = this.startPlacement.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick = (e) => {
        e.stopPropagation()
        let position = e.target.getAttribute('index')
        let squares = e.target.parentNode.childNodes
        if (this.state.ships[this.state.currentShip].rotation === 'vertical') {
            let multiplier
            for (let i = 0; i < this.state.ships[this.state.currentShip].size; i++) {
                let newMatrix = this.state.playerMatrix
                multiplier = i * 9
                newMatrix[multiplier + parseInt(position)] = 1
                this.setState({
                    playerMatrix: newMatrix
                })
            }
        } else {
            for (let i = 0; i < this.state.ships[this.state.currentShip].size; i++) {
                let newMatrix = this.state.playerMatrix
                newMatrix = newMatrix[i + parseInt(position)] = 1
                this.setState({
                    playerMatrix: newMatrix
                })
                console.log(this.state.playerMatrix)
            }
        }

        let newShips = Object.assign({}, this.state.ships);
        newShips[this.state.currentShip].placed = true
        var result = Object.keys(newShips).map(function (key) {
            return [Number(key), newShips[key]];
        })
        console.log(result)
        this.setState({
            ships: result
        }, this.runPlacement)
    }

    handleHover = (e) => {
        e.stopPropagation()
        let position = e.target.getAttribute('index')
        let squares = e.target.parentNode.childNodes
        if (this.state.ships[this.state.currentShip].rotation === 'vertical') {
            let multiplier
            for (let i = 0; i < this.state.ships[this.state.currentShip].size; i++) {
                multiplier = i * 9
                squares[multiplier + parseInt(position)].style.background = 'red'
            }
        } else {
            for (let i = 0; i < this.state.ships[this.state.currentShip].size; i++) {
                squares[i + parseInt(position)].style.background = 'red'
            }
        }
    }

    handleLeaveHover = (e) => {
        e.stopPropagation()
        let position = e.target.getAttribute('index')
        let squares = e.target.parentNode.childNodes
        if (this.state.ships[this.state.currentShip].rotation === 'vertical') {
            let multiplier
            for (let i = 0; i < this.state.ships[this.state.currentShip].size; i++) {
                multiplier = i * 9
                squares[multiplier + parseInt(position)].style.background = ''
            }
        } else {
            for (let i = 0; i < this.state.ships[this.state.currentShip].size; i++) {
                squares[i + parseInt(position)].style.background = ''
            }
        }
    }

    startPlacement = (e) => {
        this.runPlacement()
    }

    runPlacement() {
        console.log(this.state.ships)
        let ship = this.state.ships.find(ship => {
            return ship.placed === false
        })
        let index = this.state.ships.indexOf(ship)
        this.setState({
            currentShip: index
        })
    }

    render() {

        let info
        this.state.started ? info = (<div>test</div>)
            : info = (
                <div className="not_ready">
                    <button disabled={!this.state.ready} className="start">Start Game</button>
                    <button onClick={this.startPlacement} className="start">Place ships</button>
                </div>
            )

        return (
            <div className="game" >
                <NpcField />
                <section className="info">
                    {info}
                </section>
                <PlayerField
                    handleHover={this.handleHover}
                    handleLeaveHover={this.handleLeaveHover}
                    handleClick={this.handleClick} />
            </div>
        );
    }
}