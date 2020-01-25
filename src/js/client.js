import React from "react";
import ReactDOM from "react-dom";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: (new Array(20)).fill(null).map(() => (new Array(10)).fill(null)),
      points: 0,
      move_counts: 0,
      fall_speed: 1.0,
      current_tetrimino: generateTetrimino(),
      isInitialize: true,
      current_coodinate: {x: 4, y: 0},
      next_tetriminos: [generateTetrimino(), generateTetrimino(), generateTetrimino(), generateTetrimino(), generateTetrimino()],
    }
  }

  tetriminoSet() {
    let squares = this.state.squares;
    squares[this.state.current_coodinate['y']][this.state.current_coodinate['x']] = this.state.current_tetrimino[0][0];
    squares[this.state.current_coodinate['y']][this.state.current_coodinate['x']+1] = this.state.current_tetrimino[0][1];
    squares[this.state.current_coodinate['y']][this.state.current_coodinate['x']+2] = this.state.current_tetrimino[0][2];
    squares[this.state.current_coodinate['y']][this.state.current_coodinate['x']+3] = this.state.current_tetrimino[0][3];
    squares[this.state.current_coodinate['y']+1][this.state.current_coodinate['x']] = this.state.current_tetrimino[1][0];
    squares[this.state.current_coodinate['y']+1][this.state.current_coodinate['x']+1] = this.state.current_tetrimino[1][1];
    squares[this.state.current_coodinate['y']+1][this.state.current_coodinate['x']+2] = this.state.current_tetrimino[1][2];
    squares[this.state.current_coodinate['y']+1][this.state.current_coodinate['x']+3] = this.state.current_tetrimino[1][3];
    squares[this.state.current_coodinate['y']+2][this.state.current_coodinate['x']] = this.state.current_tetrimino[2][0];
    squares[this.state.current_coodinate['y']+2][this.state.current_coodinate['x']+1] = this.state.current_tetrimino[2][1];
    squares[this.state.current_coodinate['y']+2][this.state.current_coodinate['x']+2] = this.state.current_tetrimino[2][2];
    squares[this.state.current_coodinate['y']+2][this.state.current_coodinate['x']+3] = this.state.current_tetrimino[2][3];
    squares[this.state.current_coodinate['y']+3][this.state.current_coodinate['x']] = this.state.current_tetrimino[3][0];
    squares[this.state.current_coodinate['y']+3][this.state.current_coodinate['x']+1] = this.state.current_tetrimino[3][1];
    squares[this.state.current_coodinate['y']+3][this.state.current_coodinate['x']+2] = this.state.current_tetrimino[3][2];
    squares[this.state.current_coodinate['y']+3][this.state.current_coodinate['x']+3] = this.state.current_tetrimino[3][3];
    this.setState({squares: squares});
  }

  tetriminoUnset() {
    let squares = this.state.squares;
    squares[this.state.current_coodinate['y']-1][this.state.current_coodinate['x']] = null;
    squares[this.state.current_coodinate['y']-1][this.state.current_coodinate['x'] + 1] = null;
    squares[this.state.current_coodinate['y']-1][this.state.current_coodinate['x'] + 2] = null;
    squares[this.state.current_coodinate['y']-1][this.state.current_coodinate['x'] + 3] = null;
    squares[this.state.current_coodinate['y']][this.state.current_coodinate['x']] = null;
    squares[this.state.current_coodinate['y']][this.state.current_coodinate['x'] + 1] = null;
    squares[this.state.current_coodinate['y']][this.state.current_coodinate['x'] + 2] = null;
    squares[this.state.current_coodinate['y']][this.state.current_coodinate['x'] + 3] = null;
    squares[this.state.current_coodinate['y'] + 1][this.state.current_coodinate['x']] = null;
    squares[this.state.current_coodinate['y'] + 1][this.state.current_coodinate['x'] + 1] = null;
    squares[this.state.current_coodinate['y'] + 1][this.state.current_coodinate['x'] + 2] = null;
    squares[this.state.current_coodinate['y'] + 1][this.state.current_coodinate['x'] + 3] = null;
    squares[this.state.current_coodinate['y'] + 2][this.state.current_coodinate['x']] = null;
    squares[this.state.current_coodinate['y'] + 2][this.state.current_coodinate['x'] + 1] = null;
    squares[this.state.current_coodinate['y'] + 2][this.state.current_coodinate['x'] + 2] = null;
    squares[this.state.current_coodinate['y'] + 2][this.state.current_coodinate['x'] + 3] = null;
    this.setState({ squares: squares });
  }

  countDown() {
    // テトリミノを選択する場合
    if (this.state.isInitialize) {
      this.setState({isInitialize: false});
      this.setState({current_tetrimino: generateTetrimino()});
      this.tetriminoSet();
    }
    // テトリミノを選択しない場合
    else {
      this.tetriminoUnset();
      this.tetriminoSet();
    }
    let nextX = this.state.current_coodinate['x'];
    let nextY = this.state.current_coodinate['y'];
    this.setState({ current_coodinate: { x: nextX, y: nextY + 1 } });
  }

  // 初期化時に、countDownメソッドを1秒ごとに呼び出すタイマーを設定
  componentDidMount() {
    this.interval = setInterval(() => this.countDown(), 1000);
  }

  // 終了処理として、タイマーをクリアする
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className="container">
        <RecordArea points={this.state.points} move_counts={this.state.move_counts} />
        <PlayArea current_tetrimino={this.state.current_tetrimino}
                  current_coodinate={this.state.current_coodinate}
                  fall_speed={this.state.fall_speed}
                  squares={this.state.squares} />
        <NextTetriminosArea next_tetriminos={this.state.next_tetriminos} />
      </div>
    );
  }
}

class RecordArea extends React.Component {
  render() {
    return (
      <div id="record-area-box">
        <h1>Record Area</h1>
        <p>points = {this.props.points}</p>
        <p>move counts = {this.props.move_counts}</p>
      </div>
    );
  }
}

class PlayArea extends React.Component {
  render() {
    return (
      <div id="play-area-box">
        <table>
          <tbody>
            <PlayAreaColumn column={this.props.squares[0]} />
            <PlayAreaColumn column={this.props.squares[1]}/>
            <PlayAreaColumn column={this.props.squares[2]}/>
            <PlayAreaColumn column={this.props.squares[3]}/>
            <PlayAreaColumn column={this.props.squares[4]}/>
            <PlayAreaColumn column={this.props.squares[5]}/>
            <PlayAreaColumn column={this.props.squares[6]}/>
            <PlayAreaColumn column={this.props.squares[7]}/>
            <PlayAreaColumn column={this.props.squares[8]}/>
            <PlayAreaColumn column={this.props.squares[9]}/>
            <PlayAreaColumn column={this.props.squares[10]}/>
            <PlayAreaColumn column={this.props.squares[11]}/>
            <PlayAreaColumn column={this.props.squares[12]}/>
            <PlayAreaColumn column={this.props.squares[13]}/>
            <PlayAreaColumn column={this.props.squares[14]}/>
            <PlayAreaColumn column={this.props.squares[15]}/>
            <PlayAreaColumn column={this.props.squares[16]}/>
            <PlayAreaColumn column={this.props.squares[17]}/>
            <PlayAreaColumn column={this.props.squares[18]}/>
            <PlayAreaColumn column={this.props.squares[19]}/>
          </tbody>
        </table>
      </div>
    );
  }
}

class PlayAreaColumn extends React.Component {
  render() {
    return (
      <tr>
        <PlayAreaSquare square={this.props.column[0]} />
        <PlayAreaSquare square={this.props.column[1]} />
        <PlayAreaSquare square={this.props.column[2]} />
        <PlayAreaSquare square={this.props.column[3]} />
        <PlayAreaSquare square={this.props.column[4]} />
        <PlayAreaSquare square={this.props.column[5]} />
        <PlayAreaSquare square={this.props.column[6]} />
        <PlayAreaSquare square={this.props.column[7]} />
        <PlayAreaSquare square={this.props.column[8]} />
        <PlayAreaSquare square={this.props.column[9]} />
      </tr>
    );
  }
}

class PlayAreaSquare extends React.Component {
  render() {
    return (
      <td className={this.props.square}></td>
    );
  }
}

class NextTetriminosArea extends React.Component {
  render() {
    return (
      <div id="next-tetriminos-area-box">
        <h1>Next Tetriminos Area</h1>
      </div>
    );
  }
}

const app = document.getElementById('app');
ReactDOM.render(<Game/>, app);

function generateTetrimino() {
  return returnTetriminoArray(Math.floor((Math.random()) * 7));
}

function returnTetriminoArray(tetrimino_id) {
  switch(tetrimino_id) {
    case 0:
      return [['I', 'I', 'I', 'I'],
              [null, null, null, null],
              [null, null, null, null],
              [null, null, null, null]]
    case 1:
      return [['L1', null, null, null],
              ['L1', 'L1', 'L1', null],
              [null, null, null, null],
              [null, null, null, null]]
    case 2:
      return [[null, null, 'L2', null],
              ['L2', 'L2', 'L2', null],
              [null, null, null, null],
              [null, null, null, null]]
    case 3:
      return [[null, 'O', 'O', null],
              [null, 'O', 'O', null],
              [null, null, null, null],
              [null, null, null, null]]
    case 4:
      return [['Z1', 'Z1', null, null],
              [null, 'Z1', 'Z1', null],
              [null, null, null, null],
              [null, null, null, null]]
    case 5:
      return [[null, 'Z2', 'Z2', null],
              ['Z2', 'Z2', null, null],
              [null, null, null, null],
              [null, null, null, null]]
    case 6:
      return [[null, 'T', null, null],
              ['T', 'T', 'T', null],
              [null, null, null, null],
              [null, null, null, null]]
  }
}
