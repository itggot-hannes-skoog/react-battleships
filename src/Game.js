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
                <div><span>X</span></div>
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

    render() {

        let squares = []
        for (let i = 0; i < 90; i++) {
            squares.push(<Square handleClick={this.props.handleClick} key={i} datakey={i} />)
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
            NPCMatrix: [
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
            NPCships:
                [
                    {
                        name: 'Carrier',
                        size: 5,
                        rotation: 'horizontal',
                        position: null,
                        placed: false
                    },
                    {
                        name: 'Battleship',
                        size: 4,
                        rotation: 'horizontal',
                        position: null,
                        placed: false
                    },
                    {
                        name: 'Cruiser',
                        size: 3,
                        rotation: 'horizontal',
                        position: null,
                        placed: false
                    },
                    {
                        name: 'Submarine',
                        size: 3,
                        rotation: 'horizontal',
                        position: null,
                        placed: false
                    },
                    {
                        name: 'Destroyer',
                        size: 2,
                        rotation: 'horizontal',
                        position: null,
                        placed: false
                    }
                ],
            playerships:
                [
                    {
                        name: 'Carrier',
                        size: 5,
                        rotation: 'horizontal',
                        position: null,
                        placed: false
                    },
                    {
                        name: 'Battleship',
                        size: 4,
                        rotation: 'horizontal',
                        position: null,
                        placed: false
                    },
                    {
                        name: 'Cruiser',
                        size: 3,
                        rotation: 'horizontal',
                        position: null,
                        placed: false
                    },
                    {
                        name: 'Submarine',
                        size: 3,
                        rotation: 'horizontal',
                        position: null,
                        placed: false
                    },
                    {
                        name: 'Destroyer',
                        size: 2,
                        rotation: 'horizontal',
                        position: null,
                        placed: false
                    }
                ],
            tried: []
        }
        this.startPlacement = this.startPlacement.bind(this)
        this.placeShip = this.placeShip.bind(this)
        this.rotateShip = this.rotateShip.bind(this)
        this.startGame = this.startGame.bind(this)
        this.playerFire = this.playerFire.bind(this)
    }

    // SHIP PLACEMENT

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
        if (this.state.currentShip >= this.state.playerships.length - 1) {
            this.setState({
                gamestage: 'ready'
            })
        }
    }

    placeShip = (e) => {
        e.stopPropagation()
        if (this.state.gamestage === 'shipplacement') {
            let position = e.target.getAttribute('index')

            if (this.state.playerships[this.state.currentShip].rotation === 'vertical') {
                let newMatrix = this.state.playerMatrix
                let multiplier
                let affectedsquares = []

                for (let i = 0; i < this.state.playerships[this.state.currentShip].size; i++) {
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
                    }, this.updateShips(affectedsquares[0]))
                }
            } else {
                let newMatrix = this.state.playerMatrix

                let affectedsquares = []
                for (let i = 0; i < this.state.playerships[this.state.currentShip].size; i++) {
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
                    }, this.updateShips(affectedsquares[0]))
                }
            }
        }
    }

    updateShips(position) {

        let newShips = Object.assign({}, this.state.playerships);
        newShips[this.state.currentShip].placed = true
        newShips[this.state.currentShip].position = position
        let result = Object.keys(newShips).map(i => {
            return newShips[i]
        })
        this.setState({
            ships: result
        }, this.runPlacement)

        console.log(this.state.ships);
    }

    handleHover = (e) => {
        e.stopPropagation()
        if (this.state.gamestage === 'shipplacement') {
            let position = e.target.getAttribute('index')
            let squares = e.target.parentNode.childNodes
            if (this.state.playerships[this.state.currentShip].rotation === 'vertical') {
                let multiplier
                let affectedsquares = []

                for (let i = 0; i < this.state.playerships[this.state.currentShip].size; i++) {
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
                for (let i = 0; i < this.state.playerships[this.state.currentShip].size; i++) {
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
            if (this.state.playerships[this.state.currentShip].rotation === 'vertical') {
                let multiplier
                let affectedsquares = []

                for (let i = 0; i < this.state.playerships[this.state.currentShip].size; i++) {
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
                for (let i = 0; i < this.state.playerships[this.state.currentShip].size; i++) {
                    affectedsquares.push(i + parseInt(position))
                }

                let nums = [9, 18, 27, 36, 45, 54, 63, 72, 81]
                let newaff = affectedsquares.slice(1)
                let allowed = true
                for (let i = 0; i < nums.length; i++) {
                    if (newaff.includes(nums[i]) || newaff[newaff.length - 1] >= 90)
                        allowed = false
                }
                if (allowed === true) {
                    affectedsquares.forEach(sqr => {
                        squares[sqr].style.background = ''
                    })

                }
            }
        }
    }

    rotateShip() {
        let newShips = Object.assign(this.state.playerships);
        switch (newShips[this.state.currentShip].rotation) {
            case 'vertical':
                newShips[this.state.currentShip].rotation = 'horizontal'
                break
            case 'horizontal':
                newShips[this.state.currentShip].rotation = 'vertical'
                break
            default:
        }
    }

    // GAME STARTED

    startGame() {
        this.placeNPCShips()
        this.setState({
            gamestage: 'started'
        })
    }

    placeNPCShips() {
        let ships = this.state.NPCships
        let matrix = this.state.NPCMatrix
        ships.forEach(ship => {
            let rotation = Math.round(Math.random())
            let clr = '#' + Math.floor(Math.random() * 16777215).toString(16);
            if (rotation === 0) {
                ship.rotation = 'horizontal'
                let allowed = false

                while (allowed === false) {
                    let squares = this.generateHorizontalShip(ship)

                    let nums = [9, 18, 27, 36, 45, 54, 63, 72, 81]
                    let newaff = squares.slice(1)
                    allowed = true
                    for (let i = 0; i < nums.length; i++) {
                        if (newaff.includes(nums[i]) || newaff[newaff.length - 1] >= 90) {
                            allowed = false
                        }
                    }
                    for (let i = 0; i < squares.length; i++) {
                        if (matrix[squares[i]] === 1) {
                            allowed = false
                        }
                    }
                    let turk = document.querySelectorAll('.square')
                    ship.position = squares[0]

                    if (allowed === true) {
                        squares.forEach(sqr => {
                            console.log('SANT: ' + ship.name)
                            matrix[sqr] = 1
                            turk[sqr].style.background = clr
                        })
                    }
                }

            } else {
                ship.rotation = 'vertical'
                let allowed = false

                while (allowed === false) {
                    let squares = this.generateVerticalShip(ship)

                    let nums = [9, 18, 27, 36, 45, 54, 63, 72, 81]
                    let newaff = squares.slice(1)
                    allowed = true
                    for (let i = 0; i < nums.length; i++) {
                        if (newaff.includes(nums[i]) || newaff[newaff.length - 1] >= 90) {
                            allowed = false
                        }
                    }
                    for (let i = 0; i < squares.length; i++) {
                        if (matrix[squares[i]] === 1) {
                            allowed = false
                        }
                    }
                    let turk = document.querySelectorAll('.square')
                    ship.position = squares[0]

                    if (allowed === true) {
                        squares.forEach(sqr => {
                            matrix[sqr] = 1
                            turk[sqr].style.background = clr
                        })
                    }
                }
            }

        })
        this.setState({
            NPCMatrix: matrix,
            NPCships: ships
        })
    }

    generateHorizontalShip(ship) {
        let rand = Math.random()
        let position = rand * this.state.NPCMatrix.length
        position = position.toFixed()
        let squares = []

        for (let i = 0; i < ship.size; i++) {
            squares.push(parseInt(position) + i)
        }
        return squares
    }

    generateVerticalShip(ship) {
        let rand = Math.random()
        let position = rand * this.state.NPCMatrix.length
        position = position.toFixed()
        let squares = []
        let multiplier

        for (let i = 0; i < ship.size; i++) {
            multiplier = i * 9
            squares.push(multiplier + parseInt(position))
        }
        return squares
    }

    playerFire = (e) => {
        e.stopPropagation()
        if (this.state.turn === 0) {
            let position = e.target.getAttribute('index')
            let squares = e.target.parentNode.childNodes
            let matrix = this.state.NPCMatrix
            if (matrix[position] === 1) {
                squares[position].firstChild.classList.add('hit')
                matrix[position] = 2
                this.setState({
                    NPCMatrix: matrix
                })
            } else {
                squares[position].firstChild.classList.add('miss')
            }
            this.setState({
                turn: 1
            }, this.NPCFire)
        }
        if (!this.state.NPCMatrix.includes(1) || !this.state.playerMatrix.includes(1)) {
            this.setState({
                gamestage: 'gameover'
            })
        }
    }

    NPCFire() {
        if (this.state.turn === 1) {
            let position = Math.round(Math.random() * 91)
            let allowed = false
            let tried = this.state.tried
            while (allowed === false) {
                allowed = true
                if (tried.includes(position)) {
                    position = Math.round(Math.random() * 91)
                    allowed = false
                } else {
                    tried.push(position)
                }
                if (this.state.tried.length > 89) {
                    allowed = true
                }
            }
            this.setState({
                tried: tried
            })
            let matrix = this.state.playerMatrix
            let squares = document.querySelectorAll('.player .square')
            if (matrix[position] === 1) {
                squares[position].firstChild.classList.add('hit')
                matrix[position] = 2
                this.setState({
                    playerMatrix: matrix
                })
            } else {
                squares[position].firstChild.classList.add('miss')
            }
            this.setState({
                turn: 0
            })
        }
        if (!this.state.NPCMatrix.includes(1) || !this.state.playerMatrix.includes(1)) {
            this.setState({
                gamestage: 'gameover'
            })
        }
    }

    render() {

        let info = (
            <div className="not_ready">
                <button disabled={this.state.gamestage !== 'notready'} onClick={this.startPlacement}>Place ships</button>
                <button disabled={this.state.gamestage !== 'shipplacement'} onClick={this.rotateShip}>Rotate ship</button>
                <button /* disabled={this.state.gamestage !== 'ready'} */ className="start" onClick={this.startGame}>Start Game</button>
                {this.state.gamestage === 'shipplacement' ? (
                    <div className="current_ship">
                        <h1>{this.state.playerships[this.state.currentShip].name}</h1>
                        <h3>{this.state.playerships[this.state.currentShip].size}</h3>
                    </div>
                ) : ''}
                {this.state.gamestage === 'started' ? (
                    <h2>It is {this.state.turn === 0 ? ' your turn' : ' NPCs turn'}</h2>
                ) : ''}
                {this.state.gamestage === 'gameover' ? (
                    <h2>Game Over</h2>
                ) : ''}
            </div>
        )

        return (
            <div className="game" >
                <NpcField handleClick={this.playerFire} />
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