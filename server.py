
from flask import Flask, jsonify, request
from src.environment  import TicTacToe
from src.model import Model
from src.argparser import argument_parser
from src.utils import load_checkpoint, print_args
import numpy as np
app = Flask(__name__)
from flask_cors import CORS

CORS(app)
# Game state
game_state = {
    "board": [["" for _ in range(3)] for _ in range(3)],
    "current_player": "X",
    "winner": None,
    "draw": False
}
args = argument_parser()

print_args(args=args)

model = Model(args=args)
load_checkpoint(model=model, args=args)

env = TicTacToe(size=args.field_size)
@app.route('/api/new', methods=['POST'])
def reset_game():
    data=env.reset()
    return jsonify({'data':data.numpy().tolist()})

@app.route('/api/move', methods=['POST'])
def make_move():
    global env
    print(request.json)
    data= env.play_with_frontend(model=model,action=int( request.json['action']))
    if type(data) == str:
        return jsonify({'data':data})
    letsensialize=data.numpy().tolist()
    return jsonify({'data':letsensialize})
@app.route('/api/get', methods=['POST'])
def get():
    global env
    data= env.field.float()[None, ...]
    letsensialize=data.numpy().tolist()
    return jsonify({'data':letsensialize})
def check_winner(player):
    # Check rows, columns, and diagonals for a winner
    
    for row in range(3):
        if all(cell == player for cell in game_state["board"][row]):
            return True
    for col in range(3):
        if all(game_state["board"][row][col] == player for row in range(3)):
            return True
    if all(game_state["board"][i][i] == player for i in range(3)) or \
       all(game_state["board"][i][2 - i] == player for i in range(3)):
        return True
    return False



if __name__ == '__main__':
    app.run(debug=True)