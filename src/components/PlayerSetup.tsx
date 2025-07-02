'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface PlayerSetupProps {
  onStartGame: (player1Name: string, player2Name: string) => void;
}

export default function PlayerSetup({ onStartGame }: PlayerSetupProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const player1 = formData.get('player1')?.toString() || 'Player 1';
    const player2 = formData.get('player2')?.toString() || 'Player 2';
    onStartGame(player1, player2);
  };

  return (
    <Card className="p-6 w-[350px]">
      <h2 className="text-2xl font-bold mb-4 text-center">Player Setup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="player1" className="block text-sm font-medium mb-1">
            Player 1 (X)
          </label>
          <Input
            id="player1"
            name="player1"
            placeholder="Enter Player 1 name"
            required
          />
        </div>
        <div>
          <label htmlFor="player2" className="block text-sm font-medium mb-1">
            Player 2 (O)
          </label>
          <Input
            id="player2"
            name="player2"
            placeholder="Enter Player 2 name"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Start Game
        </Button>
      </form>
    </Card>
  );
}