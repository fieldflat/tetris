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

  // 降下中のテトリミノの状態をセットし，描写する
  tetriminoSet() {
    let squares = this.state.squares;
    for(let i = 0; i < 4; i += 1) {
      let x = this.state.current_coodinate['x'] + this.state.current_tetrimino['position'][i]['x'];
      let y = this.state.current_coodinate['y'] + this.state.current_tetrimino['position'][i]['y'];
      squares[y][x] = this.state.current_tetrimino['type'];
    }
    this.setState({squares: squares});
  }

  // 降下中のテトリミノの状態をアンセットする
  tetriminoUnset() {
    let squares = this.state.squares;
    for (let i = 0; i < 4; i += 1) {
      let x = this.state.current_coodinate['x'] + this.state.current_tetrimino['position'][i]['x'];
      let y = this.state.current_coodinate['y'] + this.state.current_tetrimino['position'][i]['y'];
      squares[y][x] = null;
    }
    this.setState({ squares: squares });
  }

  // current_coodinateのy座標を1降下させる．
  setNextCoodinate() {
    let nextX = this.state.current_coodinate['x'];
    let nextY = this.state.current_coodinate['y'];
    this.setState({ current_coodinate: { x: nextX, y: nextY + 1 } });
  }

  countDown() {
    // テトリミノを初期位置にセットする場合
    if (this.state.isInitialize) {
      this.setState({isInitialize: false});
      this.setState({current_tetrimino: generateTetrimino()});
      this.tetriminoSet();
    }
    // テトリミノを初期位置にセットしない場合
    else {
      this.tetriminoUnset();
      this.setNextCoodinate();
      this.tetriminoSet();
    }
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
  return returnTetrimino(Math.floor((Math.random()) * 7));
}

function returnTetrimino(tetrimino_id) {
  switch(tetrimino_id) {
    case 0:
      return {type: 'I', position: [{x:0, y:0}, {x:0, y:1}, {x:0, y:2}, {x:0, y:3}], rotate: 0};
    case 1:
      return {type: 'O', position: [{x:0, y:0}, {x:0, y:1}, {x:1, y:0}, {x:1, y:1}], rotate: 0};
    case 2:
      return {type: 'T', position: [{x:0, y:1}, {x:1, y:1}, {x:2, y:1}, {x:1, y:0}], rotate: 0};
    case 3:
      return {type: 'J', position: [{x:0, y:0}, {x:0, y:1}, {x:1, y:1}, {x:2, y:1}], rotate: 0};
    case 4:
      return {type: 'L', position: [{x:2, y:0}, {x:0, y:1}, {x:1, y:1}, {x:2, y:1}], rotate: 0};
    case 5:
      return {type: 'S', position: [{x:1, y:0}, {x:2, y:0}, {x:0, y:1}, {x:1, y:1}], rotate: 0};
    case 6:
      return {type: 'Z', position: [{x:0, y:0}, {x:1, y:0}, {x:1, y:1}, {x:2, y:1}], rotate: 0};
  }
}
