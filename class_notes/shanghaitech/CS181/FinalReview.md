# Final Review

## Probabilistic Temporal Models

Markov models

- markov assumption
- transition model



Hidden Markov models

- Transition model(state)+emssion model(evidence)
- Filter (forward)
- Most likely explanation (Viterbi)



Dynamic Bayes networks

Approximate inference by particle filter



Markov Decision Process

- state
- action
- transition probability
- rewards

quantities

- policy (core) input, output
- utility function
- values function
- q-values function

SolveMDP

- Bellman equation
- Value iteration (Based on Bellman equation) computation heavy
- Policy iteration
  - policy evaluation (based on value iteration) + policy improvement

## Reinforcement learning

Reinforcement learning

- MDP without knowing T(Transition) and R(Reward)
- Offline planning (MDP) v.s. online learning

Model-based learning

- model T,R

Model-free learning

- not model T,R, just find Policy
- Policy evaluation: Temporal Difference Learning
  - exponential moving average: as episodes grows, calculate average above new sample and old sample
- Computing Q-values/policy: Q-Learning

Exploration v.s. Exploitation

- Random exploration, exploration function

Approximate Q-Learning

- when state space are contiguous or large
- Feature-based representation of state
- example in slides

## Machine Learning

### Supervised

learn target function $f$

Classification($f$ with discrete output)

- Naive Bayes
- Generalization and overfitting, smoothing(Laplace, Slice), tuning(hypr parameters)
- Perceptron, logistic regression, neural networks

Regression($f$ with continuous output)

- linear regression
- minimizing summed squared error
- regularization

### Unsupervised

K-means

EM

## LLM

autoregressive models

word embedding

attention mechanism

- Q, K, V
- self-attention
- Causal mask

self-supervised learning

- multi-class classification on sequence data

Decoding strategy

- Beam search