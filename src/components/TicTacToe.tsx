'use client';

import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PlayerSetup from './PlayerSetup';
import confetti from 'canvas-confetti';

type Square = 'X' | 'O' | null;

interface Scores {
  player1: number;
  player2: number;
}

const calculateWinner = (squares: Square[]): Square => {
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

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

// Confetti animation function
const triggerConfetti = () => {
  // First burst
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });

  // Second burst after a small delay
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });
  }, 200);
};

export default function TicTacToe() {
  const [squares, setSquares] = useState<Square[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState<Scores>({ player1: 0, player2: 0 });
  const [player1Name, setPlayer1Name] = useState<string>('');
  const [player2Name, setPlayer2Name] = useState<string>('');
  const [gameStarted, setGameStarted] = useState(false);
  const [isWinnerCelebrated, setIsWinnerCelebrated] = useState(false);

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(square => square !== null);

  // Check for winner and trigger confetti
  const checkWinnerAndCelebrate = useCallback((currentSquares: Square[]) => {
    const winner = calculateWinner(currentSquares);
    if (winner && !isWinnerCelebrated) {
      triggerConfetti();
      setIsWinnerCelebrated(true);
    }
  }, [isWinnerCelebrated]);

  const handleClick = (i: number) => {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);

    // Check for winner after move
    const nextWinner = calculateWinner(nextSquares);
    if (nextWinner) {
      setScores(prev => ({
        ...prev,
        [nextWinner === 'X' ? 'player1' : 'player2']: 
          prev[nextWinner === 'X' ? 'player1' : 'player2'] + 1
      }));
      checkWinnerAndCelebrate(nextSquares);
    }
  };

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setIsWinnerCelebrated(false);
  };

  const resetScores = () => {
    setScores({ player1: 0, player2: 0 });
  };

  const startNewGame = (p1Name: string, p2Name: string) => {
    setPlayer1Name(p1Name);
    setPlayer2Name(p2Name);
    setGameStarted(true);
    setScores({ player1: 0, player2: 0 });
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setIsWinnerCelebrated(false);
  };

  const renderSquare = (i: number) => (
    <Button
      variant="outline"
      className={`h-20 w-20 text-2xl font-bold ${
        winner && squares[i] === winner ? 'bg-green-100 dark:bg-green-900' : ''
      }`}
      onClick={() => handleClick(i)}
    >
      {squares[i]}
    </Button>
  );

  const currentPlayer = xIsNext ? player1Name : player2Name;
  const status = winner
    ? `Winner: ${winner === 'X' ? player1Name : player2Name}`
    : isDraw
    ? 'Draw!'
    : `Next player: ${currentPlayer} (${xIsNext ? 'X' : 'O'})`;

  if (!gameStarted) {
    return <PlayerSetup onStartGame={startNewGame} />;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        {/* Score Display */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-muted p-3 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-muted-foreground">Player 1 (X)</div>
                <div className="font-medium">{player1Name}</div>
              </div>
              <div className="text-2xl font-bold">{scores.player1}</div>
            </div>
          </div>
          <div className="bg-muted p-3 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-muted-foreground">Player 2 (O)</div>
                <div className="font-medium">{player2Name}</div>
              </div>
              <div className="text-2xl font-bold">{scores.player2}</div>
            </div>
          </div>
        </div>

        {/* Game Status */}
        <div className="mb-4 text-xl font-bold text-center">
          <span className={winner ? 'text-green-600 dark:text-green-400' : ''}>
            {status}
          </span>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-2">
          {[...Array(9)].map((_, i) => (
            <div key={i}>{renderSquare(i)}</div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <Button 
            className="w-full"
            onClick={resetGame}
          >
            Next Round
          </Button>
          <Button 
            className="w-full"
            variant="secondary"
            onClick={resetScores}
          >
            Reset Scores
          </Button>
          <Button 
            className="w-full"
            variant="outline"
            onClick={() => setGameStarted(false)}
          >
            New Game
          </Button>
        </div>
      </Card>
      <div className="flex justify-center items-center">
        <h2 className="text-sm text-muted-foreground">Created using React, Next.js, Tailwind CSS, and Shadcn/UI</h2>
      </div>
    </div>
  );
}