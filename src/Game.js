import React, { Component } from 'react';
import './game.css'

class Square extends Component {

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
            gamestage: 'notready',
            turn: 0,
            currentShip: -1,
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
        this.placeShip = this.placeShip.bind(this)
        this.rotateShip = this.rotateShip.bind(this)
    }

    placeShip = (e) => {
        e.stopPropagation()
        let position = e.target.getAttribute('index')

        if (this.state.ships[this.state.currentShip].rotation === 'vertical') {
            let newMatrix = this.state.playerMatrix
            let multiplier
            let affectedsquares = []

            for (let i = 0; i < this.state.ships[this.state.currentShip].size; i++) {
                multiplier = i * 9
                affectedsquares.push(multiplier + parseInt(position))
            }

            let nums = [81, 82, 83, 84, 85, 86, 87, 88, 89, 90]
            let newaff = affectedsquares.slice(0, -1)
            let allowed = true
            for (let i = 0; i < nums.length; i++) {
                if (newaff.includes(nums[i])) {
                    allowed = false
                }
            }

            affectedsquares.forEach(sqr => {
                if (newMatrix[sqr] === 1) {
                    allowed = false
                }
            })

            if (allowed === true) {
                affectedsquares.forEach(sqr => {
                    newMatrix[sqr] = 1
                })
                this.setState({
                    playerMatrix: newMatrix
                }, this.updateShips)
            }
        } else {
            let newMatrix = this.state.playerMatrix

            let affectedsquares = []
            for (let i = 0; i < this.state.ships[this.state.currentShip].size; i++) {
                affectedsquares.push(i + parseInt(position))
            }

            let nums = [9, 18, 27, 36, 45, 54, 63, 72, 81]
            let newaff = affectedsquares.slice(1)
            let allowed = true
            for (let i = 0; i < nums.length; i++) {
                if (newaff.includes(nums[i]) || newaff[newaff.length - 1] >= 90) {
                    allowed = false
                }
            }

            affectedsquares.forEach(sqr => {
                if (newMatrix[sqr] === 1) {
                    allowed = false
                }
            })

            if (allowed === true) {
                affectedsquares.forEach(sqr => {
                    newMatrix[sqr] = 1
                })
                this.setState({
                    playerMatrix: newMatrix
                }, this.updateShips)

            }
        }
    }

    updateShips() {

        let newShips = Object.assign({}, this.state.ships);
        newShips[this.state.currentShip].placed = true
        let result = Object.keys(newShips).map(i => {
            return newShips[i]
        })
        this.setState({
            ships: result
        }, this.runPlacement)

    }

    handleHover = (e) => {
        e.stopPropagation()
        if (this.state.gamestage === 'shipplacement') {
            let position = e.target.getAttribute('index')
            let squares = e.target.parentNode.childNodes
            if (this.state.ships[this.state.currentShip].rotation === 'vertical') {
                let multiplier
                let affectedsquares = []

                for (let i = 0; i < this.state.ships[this.state.currentShip].size; i++) {
                    multiplier = i * 9
                    affectedsquares.push(multiplier + parseInt(position))
                }

                let nums = [81, 82, 83, 84, 85, 86, 87, 88, 89, 90]
                let newaff = affectedsquares.slice(0, -1)
                let allowed = true
                for (let i = 0; i < nums.length; i++) {
                    if (newaff.includes(nums[i])) {
                        allowed = false
                    }
                }
                if (allowed === true) {
                    affectedsquares.forEach(sqr => {
                        squares[sqr].style.background = 'green'
                    })
                }
            } else {
                let affectedsquares = []
                for (let i = 0; i < this.state.ships[this.state.currentShip].size; i++) {
                    affectedsquares.push(i + parseInt(position))
                }

                let nums = [9, 18, 27, 36, 45, 54, 63, 72, 81]
                let newaff = affectedsquares.slice(-1)
                let allowed = true
                for (let i = 0; i < nums.length; i++) {
                    if (newaff.includes(nums[i]) || newaff[newaff.length - 1] >= 90) {
                        allowed = false
                    }
                }
                if (allowed === true) {
                    affectedsquares.forEach(sqr => {
                        squares[sqr].style.background = 'green'
                    })

                }
            }
        }
    }

    handleLeaveHover = (e) => {
        e.stopPropagation()
        if (this.state.gamestage === 'shipplacement') {
            let position = e.target.getAttribute('index')
            let squares = e.target.parentNode.childNodes
            if (this.state.ships[this.state.currentShip].rotation === 'vertical') {
                let multiplier
                let affectedsquares = []
                
                for (let i = 0; i < this.state.ships[this.state.currentShip].size; i++) {
                    multiplier = i * 9
                    affectedsquares.push(multiplier + parseInt(position))
                }

                let nums = [81, 82, 83, 84, 85, 86, 87, 88, 89, 90]
                let newaff = affectedsquares.slice(0, -1)
                let allowed = true
                for (let i = 0; i < nums.length; i++) {
                    if (newaff.includes(nums[i])) {
                        allowed = false
                    }
                }

                if (allowed === true) {
                    affectedsquares.forEach(sqr => {
                        squares[sqr].style.background = ''
                    })
                }
            } else {
                let affectedsquares = []
                for (let i = 0; i < this.state.ships[this.state.currentShip].size; i++) {
                    affectedsquares.push(i + parseInt(position))
                }

                let nums = [9, 18, 27, 36, 45, 54, 63, 72, 81]
                let newaff = affectedsquares.slice(1)
                let allowed = true
                for (let i = 0; i < nums.length; i++) {
                    if (newaff.includes(nums[i]) || newaff[newaff.length - 1] >= 90)
                        allowed = false
                }
                console.log(allowed)
                if (allowed === true) {
                    affectedsquares.forEach(sqr => {
                        squares[sqr].style.background = ''
                    })

                }
            }
        }
    }

    startPlacement = (e) => {
        this.setState({
            gamestage: 'shipplacement'
        })
        this.runPlacement()
    }

    runPlacement() {
        let placed = []
        for (let i = 0; i < this.state.playerMatrix.length; i++) {
            if (this.state.playerMatrix[i] === 1) {
                placed.push(i)
            }
        }
        let squares = document.querySelectorAll('.player .square')
        placed.forEach(pos => {
            squares[pos].classList.add('placed')
        })
        this.setState({
            currentShip: this.state.currentShip + 1
        })
        if (this.state.currentShip >= this.state.ships.length - 1) {
            this.setState({
                gamestage: 'ready'
            })
        }
    }

    rotateShip() {
        let newShips = Object.assign(this.state.ships);
        switch (newShips[this.state.currentShip].rotation) {
            case 'vertical':
                newShips[this.state.currentShip].rotation = 'horizontal'
                break
            case 'horizontal':
                newShips[this.state.currentShip].rotation = 'vertical'
                break
        }
    }

    render() {

        let info
        this.state.started ? info = (<div>test</div>)
            : info = (
                <div className="not_ready">
                    <button disabled={this.state.gamestage !== 'ready'} className="start">Start Game</button>
                    <button disabled={this.state.gamestage !== 'notready'} onClick={this.startPlacement}>Place ships</button>
                    <button disabled={this.state.gamestage !== 'shipplacement'} onClick={this.rotateShip}>Rotate ship</button>
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
                    handleClick={this.placeShip} />
            </div>
        );
    }
}