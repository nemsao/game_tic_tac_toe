"""Script with helper functions."""
import warnings
import functools
import pathlib
import random

import numpy
import torch


def set_random_seed(seed: int = 0) -> None:
    """Sets random seed."""
    numpy.random.seed(seed)
    random.seed(seed)
    torch.manual_seed(seed)


def save_checkpoint(model: torch.nn.Module, model_name: str, args) -> None:
    """Saves model checkpoint.       """
    checkpoint_name = f"{f'{model_name}_{args.algorithm}' if model_name else 'model'}"
    checkpoint_path = "weights"
    model_path = pathlib.Path(checkpoint_path) / f"{checkpoint_name}.pth"

    torch.save(obj=model.state_dict(), f=model_path)


def load_checkpoint(model: torch.nn.Module, args) -> None:
    """Loads model from checkpoint.   """
    checkpoint_name = f"{f'{args.model_name}_{args.algorithm}' if args.model_name else 'model'}"
    checkpoint_path = "weights"
    model_path = pathlib.Path(checkpoint_path) / f"{checkpoint_name}.pth"

    if model_path.is_file():
        state_dict = torch.load(f=model_path)
        model.load_state_dict(state_dict=state_dict)
        print(f"\nModel '{checkpoint_name}' loaded.\n")
    else:
        warnings.warn(f"\nModel checkpoint '{checkpoint_name}' not found. " "Continuing with random weights.\n")


def print_args(args) -> None:
    """Prints parsed arguments to console.   """
    print("Configuration:\n")
    representation = "{k:.<32}{v}"
    for key, value in vars(args).items():
        print(representation.format(k=key, v=value))
    print()


def eval(function: callable) -> callable:
    """Evaluation decorator for class methods.  """

    @functools.wraps(function)
    def eval_wrapper(self, *args, **kwargs):
        self.eval()
        out = function(self, *args, **kwargs)
        self.train()
        return out

    return eval_wrapper
