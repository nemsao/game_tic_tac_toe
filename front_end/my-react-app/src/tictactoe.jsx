import React, { useState, useEffect } from 'react';
import './index.css';

const API_BASE_URL = 'http://localhost:5000/api'; // Thay đổi URL theo backend của bạn

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Khởi tạo game mới khi component được mount
  useEffect(() => {
    createNewGame();
  }, []);

  // Tạo game mới
  const createNewGame = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể tạo game mới');
      }

      const data = await response.json();
      setBoard(Array(9).fill(null));
      setXIsNext(true);
      setError(null);
    } catch (err) {
      setError('Lỗi khi tạo game mới: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Thực hiện nước đi
  const makeMove = async (position) => {
    if ( loading) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
         'action': position,
        }),
      });

      if (!response.ok) {
        throw new Error('Nước đi không hợp lệ');
      }

      const data = await response.json();
      console.log(data);
      setBoard(data.data.flat());
      setXIsNext(!xIsNext);
      
      // Kiểm tra kết thúc game
  
      
      setError(null);
    } catch (err) {
      setError('Lỗi khi thực hiện nước đi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý click vào ô
  const handleClick = (i) => {
    if (board[i] || loading) {
      return;
    }
    makeMove(i);
  };

  // Tính người thắng
  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(square => square !== null);

  const getStatus = () => {
    if (loading) return 'Đang xử lý...';
    if (winner) return `Người chiến thắng: ${winner}`;
    if (isDraw) return 'Hòa!';
    return `Lượt tiếp theo: ${xIsNext ? 'X' : 'O'}`;
  };

  const renderSquare = (i) => {
    return (
      <button 
        className={`square ${loading ? 'disabled' : ''}`}
        onClick={() => handleClick(i)}
        disabled={loading}
      >
        {board[i]==-1?'X':board[i]==1? 'O':''}
      </button>
    );
  };

  return (
    <div className="game-container">
      <h1 className="game-title">Tic Tac Toe</h1>
      {console.log(board)}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="game-status">{getStatus()}</div>
      
      <div className="game-board">
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
      
      <button 
        className={`reset-button ${loading ? 'disabled' : ''}`}
        onClick={createNewGame}
        disabled={loading}
      >
        Chơi lại
      </button>
    </div>
  );
};

export default TicTacToe;