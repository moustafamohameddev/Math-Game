# Math-Game

🧮 Math Quiz Game – C++

A simple and interactive math quiz game built in C++. The program generates random arithmetic questions based on difficulty and operation type, evaluates the user’s answers, and displays a final score report.
This project is perfect for beginners who want to practice C++ fundamentals while building a fun console-based game.

📌 Overview

The Math Quiz Game dynamically generates math problems (addition, subtraction, multiplication, and division) depending on the selected difficulty level and operation type. The player answers a series of questions, and the program calculates the number of correct and incorrect answers, then determines if the user passed or failed the quiz.

✨ Features

🔢 Randomly generated math questions

🎚️ Multiple difficulty levels (Easy, Medium, Hard, Mixed)

➕➖✖️➗ Multiple operation types (Add, Subtract, Multiply, Divide, Mixed)

📝 Real-time answer checking

🟢/🔴 Console color feedback for correct/wrong answers

📊 Final quiz summary (correct, wrong, pass/fail)

🧱 Well-structured code using:

Functions

Structs

Enums

Random number generation

🛠️ Technologies Used

C++

<iostream>

<cstdlib>

<ctime>

Structs & Enums

Console color commands (Windows)

🚀 How to Run the Program
1️⃣ Clone the repository
git clone <repository link>

2️⃣ Compile the program
g++ main.cpp -o MathQuiz

3️⃣ Run the game
./MathQuiz

📌 How the Game Works

The program sets:

Number of questions

Difficulty level

Operation type

For each question:

Two numbers are generated based on difficulty

A random operation may be selected

The player inputs an answer

The program checks correctness and updates the score

At the end, the player receives a summary:

✔️ Number of correct answers

❌ Number of wrong answers

🟩 Passed or 🟥 Failed

🧱 Code Structure
Key Components

enQuestionsLevel – Difficulty control

enOperationType – Math operation selection

stQuestion – Holds data for a single question

stQuizz – Stores all quiz details

RandomNumber() – Generates random values

SimpleCalculator() – Performs operations

GenerateQuestion() – Creates a full question

AskAndCorrectQuestionListAnswers() – Runs the quiz

PlayMathGame() – Main quiz controller

📖 Example Output
Question [1/5]  
8 + 3 = 11  
Correct!

Question [2/5]  
12 x 4 = 45  
Wrong! Correct Answer: 48

Quiz Completed! Right Answers: 4, Wrong Answers: 1
You Passed the Quiz!

🎯 Learning Objectives

This project is ideal for beginners to practice:

Input/output handling

Conditional logic

Functions and modular design

Random number generation

Structs and Enums in C++

Building simple console applications

🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests to improve the project or add new features.

📄 License

This project is open-source and available under the MIT License.

If you want, I can also:

✅ Add badges (C++, License, Stars, etc.)
✅ Add screenshots of console output
✅ Add a features table
Just tell me!
