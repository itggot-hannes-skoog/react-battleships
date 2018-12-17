import React, { Component } from 'react';
import './game.css'
import Carrier from './assets/icons/Carrier.png';
import Battleship from './assets/icons/Battleship.png';
import Cruiser from './assets/icons/Cruiser.png';
import Submarine from './assets/icons/Submarine.png';
import Destroyer from './assets/icons/Destroyer.png';

// Square component which functions are derived from props
class Square extends Component {

    render() {
        return (
            <div className="square"
                onClick={this.props.handleClick}
                onMouseEnter={this.props.handleHover}
                onMouseLeave={this.props.handleLeaveHover}
                index={this.props.datakey}>
                <div></div>
            </div>
        )
    }
}

// Players field
class PlayerField extends Component {

    render() {

        // Skapa 90 squares och skicka in props från props
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

// NPC's field
class NpcField extends Component {

    render() {

        // Skapa 90 squares och skicka in props från props
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

// The game itself
export default class Game extends Component {

    // Initiera states and bind functions to this
    constructor(props) {
        super(props)
        this.state = {
            gamestage: 'notready',
            turn: 0,
            currentShip: -1,
            hit: false,
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
                        placed: false,
                        state: [0, 0, 0, 0, 0]
                    },
                    {
                        name: 'Battleship',
                        size: 4,
                        rotation: 'horizontal',
                        position: null,
                        placed: false,
                        state: [0, 0, 0, 0]
                    },
                    {
                        name: 'Cruiser',
                        size: 3,
                        rotation: 'horizontal',
                        position: null,
                        placed: false,
                        state: [0, 0, 0]
                    },
                    {
                        name: 'Submarine',
                        size: 3,
                        rotation: 'horizontal',
                        position: null,
                        placed: false,
                        state: [0, 0, 0]
                    },
                    {
                        name: 'Destroyer',
                        size: 2,
                        rotation: 'horizontal',
                        position: null,
                        placed: false,
                        state: [0, 0]
                    }
                ],
            tried: [],
            NPCHitInfo: {
                position: null,
                hit: false,
                direction: null,
                dirconfirmed: false,
                done: null,
                searchingdir: false,
                active: false
            }
        }
        this.startPlacement = this.startPlacement.bind(this)
        this.placeShip = this.placeShip.bind(this)
        this.rotateShip = this.rotateShip.bind(this)
        this.startGame = this.startGame.bind(this)
        this.playerFire = this.playerFire.bind(this)
    }
    
    // Update gamestate and start placement of player's ships
    startPlacement = (e) => {
        this.setState({
            gamestage: 'shipplacement'
        })
        this.runPlacement()
    }

    // Run player's ship placement procedure
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

    // Clickfunction to place player's ship
    placeShip = (e) => {
        e.stopPropagation()
        if (this.state.gamestage === 'shipplacement') {
            let position = e.target.getAttribute('index')

            // Decide which way ship is rotated and run the placement accordingly
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
                    }, this.updateShips(affectedsquares))
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
                    }, this.updateShips(affectedsquares))
                }
            }
        }
    }

    // Update the state of placed ship
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

    }

    // Hoverfunction, highlight affeced squares on hover
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
                        squares[sqr].style.background = 'rgb(38, 84, 128)'
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
                        squares[sqr].style.background = 'rgb(38, 84, 128)'
                    })

                }
            }
        }
    }

    // Remove highlight on hover leave
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

    // Clickfunction to rotate ship for placement
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

    // Run function to place NPC's ships, then start game
    startGame() {
        this.placeNPCShips()
        this.setState({
            gamestage: 'started'
        })
    }

    // Place NPC ships
    placeNPCShips() {
        let ships = this.state.NPCships
        let matrix = this.state.NPCMatrix
        ships.forEach(ship => {
            let rotation = Math.round(Math.random())
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
                    ship.position = squares[0]

                    if (allowed === true) {
                        squares.forEach(sqr => {
                            matrix[sqr] = 1
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
                    ship.position = squares[0]

                    if (allowed === true) {
                        squares.forEach(sqr => {
                            matrix[sqr] = 1
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

    // Generate horizontal ship for NPC
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

    // Generate vertical ship for NPC
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

    // Clickfunction for player to fire on NPC's field
    playerFire = (e) => {
        e.stopPropagation()
        if (this.state.turn === 0 && this.state.gamestage === 'started') {
            let position = e.target.getAttribute('index')
            let squares = e.target.parentNode.childNodes
            let matrix = this.state.NPCMatrix
            if (matrix[position] === 1) {
                squares[position].firstChild.classList.add('hit')
                matrix[position] = 2
                this.setState({
                    NPCMatrix: matrix,
                    hit: true
                })
            } else {
                squares[position].firstChild.classList.add('miss')
                this.setState({
                    hit: false
                })
            }
            this.setState({
                turn: 1
            }, this.NPCFire)
            if (!this.state.NPCMatrix.includes(1) || !this.state.playerMatrix.includes(1)) {
                this.setState({
                    gamestage: 'gameover'
                })
            }
        }
    }

    // Function for NPC to fire on players field
    NPCFire() {
        if (this.state.turn === 1) {
            let allowed = false
            let tried = this.state.tried
            let position

            if (this.state.NPCHitInfo.hit === true || this.state.NPCHitInfo.searchingdir === true) {
                position = this.NPCAi()
            } else {
                position = Math.floor(Math.random() * 90)
            }

            while (allowed === false) {
                allowed = true
                if (tried.includes(position) || position > 90 || position < 0) {
                    position = Math.floor(Math.random() * 90)
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
                let ships = this.state.playerships
                let output
                ships.map(ship => {
                    if (ship.position.includes(position)) {
                        output = ship.state[ship.position.indexOf(position)] = 1
                    }
                    return output
                })
                let NPCHitInfo = this.state.NPCHitInfo
                NPCHitInfo.hit = true
                NPCHitInfo.position = position
                this.setState({
                    playerMatrix: matrix,
                    hit: true,
                    NPCHitInfo: NPCHitInfo
                })
            } else {
                squares[position].firstChild.classList.add('miss')
                let NPCHitInfo = this.state.NPCHitInfo
                NPCHitInfo.hit = false
                if (NPCHitInfo.active) {
                    NPCHitInfo.dirconfirmed = false
                    NPCHitInfo.active = false
                }
                this.setState({
                    hit: false,
                    NPCHitInfo: NPCHitInfo
                })
            }
            this.setState({
                turn: 0
            })
            if (!this.state.NPCMatrix.includes(1) || !this.state.playerMatrix.includes(1)) {
                this.setState({
                    gamestage: 'gameover'
                })
            }
        }
    }

    // NPC Ai to be used if NPC hits a shot
    NPCAi() {
        let NPCHitInfo = this.state.NPCHitInfo
        let directions = ['up', 'right', 'down', 'left']
        let position = NPCHitInfo.position
        
        if (NPCHitInfo.active === true && NPCHitInfo.hit === true) {
            NPCHitInfo.dirconfirmed = true
        }

        if (NPCHitInfo.dirconfirmed === false) {
            NPCHitInfo.searchingdir = true
            NPCHitInfo.direction = directions[(directions.indexOf(NPCHitInfo.direction) + 1) % 4]
        } else {
            NPCHitInfo.searchingdir = false
        }

        switch (NPCHitInfo.direction) {
            case 'up': position -= 9
                break
            case 'right': position += 1
                break
            case 'down': position += 9
                break
            case 'left': position -= 1
                break
            default: break
        }
        NPCHitInfo.active = true
        this.setState({
            NPCHitInfo: NPCHitInfo
        })
        return position
    }

    render() {

        // Initialize all info content
        let controllbtn
        let infotxt
        let additional
        let icon

        // Change info content based on gamestage etcetera
        switch (this.state.gamestage) {
            case 'notready':
                controllbtn = <div className="controlbtn" onClick={this.startPlacement}><h3>Place ships</h3></div>
                infotxt = <h2>Press the button to place ships</h2>
                break;
            case 'shipplacement':
                controllbtn = <div className="controlbtn" onClick={this.rotateShip}><h3>Rotate ship</h3></div>
                infotxt = <h2>Please place your ships</h2>
                switch (this.state.playerships[this.state.currentShip].name) {
                    case 'Carrier':
                        icon = <img src={Carrier} alt="Carrier"></img>
                        break;
                    case 'Battleship':
                        icon = <img src={Battleship} alt="Battleship"></img>
                        break;
                    case 'Cruiser':
                        icon = <img src={Cruiser} alt="Cruiser"></img>
                        break;
                    case 'Submarine':
                        icon = <img src={Submarine} alt="Submarine"></img>
                        break;
                    case 'Destroyer':
                        icon = <img src={Destroyer} alt="Destroyer"></img>
                        break;
                    default: break
                }
                additional = (
                    <div className="current-ship">
                        <h1>{this.state.playerships[this.state.currentShip].name}</h1>
                        <h3>Size: {this.state.playerships[this.state.currentShip].size}</h3>
                        <div className="ship-icon">{icon}</div>
                    </div>)
                break;
            case 'ready':
                controllbtn = <div className="controlbtn" onClick={this.startGame}><h3>Start Game</h3></div>
                break;
            case 'started':
                infotxt = (<h2>It is {this.state.turn === 0 ? ' your turn' : ' NPCs turn'}</h2>)
                additional = (
                    <div>
                        <h4>{this.state.turn === 1 ? 'Player' : 'NPC'} {this.state.hit === true ? 'hit!' : 'missed!'}</h4>
                        <h3>Your ships</h3>
                        {this.state.playerships.map((ship, i) => {
                            switch (ship.name) {
                                case 'Carrier':
                                    icon = <img src={Carrier} alt="Carrier"></img>
                                    break;
                                case 'Battleship':
                                    icon = <img src={Battleship} alt="Battleship"></img>
                                    break;
                                case 'Cruiser':
                                    icon = <img src={Cruiser} alt="Cruiser"></img>
                                    break;
                                case 'Submarine':
                                    icon = <img src={Submarine} alt="Submarine"></img>
                                    break;
                                case 'Destroyer':
                                    icon = <img src={Destroyer} alt="Destroyer"></img>
                                    break;
                                default: break
                            }
                            return (
                                <section key={`ship + ${i}`} className="ship">
                                    <h3 className={ship.state.includes(0) ? "" : "struken"}>{ship.name}</h3>
                                    <div className="shipinfo">
                                        <div className="ship-icon">{icon}</div>
                                        <div className="shipstate">
                                            {ship.state.map((state, i) => {
                                                if (state === 0) {
                                                    return <div key={`infohit ${ship.name} ${i}`} className="infomiss"></div>
                                                } else {
                                                    return <div key={`infomiss ${ship.name} ${i}`} className="infohit"></div>
                                                }
                                            })}
                                        </div>
                                    </div>
                                </section>
                            )
                        })}
                    </div>
                )
                break;
            case 'gameover':
                infotxt = <h2>Game Over</h2>
                additional = <form action="/"><button className="controlbtn"><h2>Restart game</h2></button></form>
                break;
            default: break
        }

        // Return all components and info
        return (
            <div className="game" >
                <NpcField handleClick={this.playerFire} />
                <section className="info">
                    {infotxt}
                    {controllbtn}
                    {additional}
                </section>
                <PlayerField
                    handleHover={this.handleHover}
                    handleLeaveHover={this.handleLeaveHover}
                    handleClick={this.placeShip} />
            </div>
        );
    }
}