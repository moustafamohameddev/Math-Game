#include<iostream>
using namespace std;

enum enQuestionLevel { Easy = 1, Medium = 2, Hard = 3, Mix = 4 };
enum enOperationType { Add = 1, Sub = 2, Mult = 3, Div = 4, MixOp = 5 };

struct stQuestion
{
    int Number1 = 0;
    int Number2 = 0;
    enOperationType OperationType;
    enQuestionLevel QuestionLevel;
    int CorrectAnswer = 0;
    int PlayerAnswer = 0;
    bool AnswerResult = false;
};

struct stQuiz
{
    stQuestion QuestionList[100];
    short NumberOfQuestions = 0;
    enQuestionLevel QuestionsLevel;
    enOperationType OperType;
    short RightAnswers = 0;
    short WrongAnswers = 0;
    bool isPass = false;
};

int RandomNumber(int From, int To)
{
    int randNum = rand() % (To - From + 1) + From;

    return randNum;
}

string QuestionLevelName(enQuestionLevel QuestionLevel)
{
    string arrQuestionLevel[4] = { "Easy", "Medium", "Hard", "Mix" };
    return arrQuestionLevel[QuestionLevel - 1];
}

string GetOperationSymbol(enOperationType OpType)
{
    string arrOpType[5] = { "+", "-", "x", "/", "Mix" };
    return arrOpType[OpType - 1];
}

void SetScreenColor(bool Right)
{
    if (Right)
    {
        system("color 2F"); 
    }
    else
    {
        system("color 4F"); 
        cout << "\a";
    }
}

short ReadHowManyQuestions()
{
    short NumberOfQuestions = 0;

    do
    {
        cout << "How many questions do you want to answer? [1-10]: ";
        cin >> NumberOfQuestions;

    } while (NumberOfQuestions < 1 || NumberOfQuestions > 10);

    return NumberOfQuestions;
}

enQuestionLevel ReadQuestionLevel()
{
    short QuestionLevel = 0;

    do
    {
        cout << "Enter question level: [1]:Easy, [2]:Medium, [3]:Hard, [4]:Mix ? ";
        cin >> QuestionLevel;

    } while (QuestionLevel < 1 || QuestionLevel > 4);

    return (enQuestionLevel)QuestionLevel;
}

enOperationType ReadOpType()
{
    short OpType = 0;

    do
    {
        cout << "Enter operation type: [1]:Add, [2]:Sub, [3]:Mult, [4]:Div, [5]:Mix ? ";
        cin >> OpType;

    } while (OpType < 1 || OpType > 5);

    return (enOperationType)OpType;
}

int SimpleCalculator(int Number1, int Number2, enOperationType OpType)
{
    switch (OpType)
    {
    case enOperationType::Add:
        return Number1 + Number2;
    case enOperationType::Sub:
        return Number1 - Number2;
    case enOperationType::Mult:
        return Number1 * Number2;
    case enOperationType::Div:
        return Number1 / Number2;
    default:
        return Number1 + Number2;
    }
}

enOperationType GetRandomOperationType()
{
    int Op = RandomNumber(1, 4);
    return (enOperationType)Op;
}

stQuestion GenerateQuestion(enQuestionLevel QuestionLevel, enOperationType OpType)
{
    stQuestion Question;

    if (QuestionLevel == enQuestionLevel::Mix)
    {
        QuestionLevel = (enQuestionLevel)RandomNumber(1, 3);
    }

    if (OpType == enOperationType::MixOp)
    {
        OpType = GetRandomOperationType();
    }

    Question.OperationType = OpType;

    switch (QuestionLevel)
    {
    case enQuestionLevel::Easy:
        Question.Number1 = RandomNumber(1, 10);
        Question.Number2 = RandomNumber(1, 10);

        Question.CorrectAnswer = SimpleCalculator(Question.Number1, Question.Number2, Question.OperationType);
        Question.QuestionLevel = QuestionLevel;

        return Question;

    case enQuestionLevel::Medium:
        Question.Number1 = RandomNumber(10, 50);
        Question.Number2 = RandomNumber(10, 50);

        Question.CorrectAnswer = SimpleCalculator(Question.Number1, Question.Number2, Question.OperationType);
        Question.QuestionLevel = QuestionLevel;

        return Question;

    case enQuestionLevel::Hard:
        Question.Number1 = RandomNumber(50, 100);
        Question.Number2 = RandomNumber(50, 100);

        Question.CorrectAnswer = SimpleCalculator(Question.Number1, Question.Number2, Question.OperationType);
        Question.QuestionLevel = QuestionLevel;

        return Question;
    }
}

void GenerateQuizQuestion(stQuiz& Quiz)
{
    for (short Question = 0; Question < Quiz.NumberOfQuestions; Question++)
    {
        Quiz.QuestionList[Question] = GenerateQuestion(Quiz.QuestionsLevel, Quiz.OperType);
    }
}

int ReadQuestionAnswer()
{
    int Answer = 0;
    cin >> Answer;
    return Answer;
}

void PrintTheQuestion(stQuiz& Quiz, short QuestionNumber)
{
    cout << "\n";
    cout << "Question [" << QuestionNumber + 1 << "/" << Quiz.NumberOfQuestions << "] \n\n";
    cout << Quiz.QuestionList[QuestionNumber].Number1 << endl;
    cout << Quiz.QuestionList[QuestionNumber].Number2 << " ";
    cout << GetOperationSymbol(Quiz.QuestionList[QuestionNumber].OperationType) << "\n";
    cout << "_" << endl;
}

void CorrectTheQuestionAnswer(stQuiz& Quiz, short QuestionNumber)
{
    if (Quiz.QuestionList[QuestionNumber].PlayerAnswer !=
        Quiz.QuestionList[QuestionNumber].CorrectAnswer)
    {
        Quiz.QuestionList[QuestionNumber].AnswerResult = false;
        Quiz.WrongAnswers++;

        cout << "Wrong Answer :-( \n";
        cout << "The right answer is: " << Quiz.QuestionList[QuestionNumber].CorrectAnswer;
        cout << "\n";
    }
    else
    {
        Quiz.QuestionList[QuestionNumber].AnswerResult = true;
        Quiz.RightAnswers++;

        cout << "Right Answer :-) \n";
    }

    cout << endl;

    SetScreenColor(Quiz.QuestionList[QuestionNumber].AnswerResult);
}

void AskAndCorrectQuestionListAnswers(stQuiz& Quiz)
{
    for (short QuestionNumber = 0; QuestionNumber < Quiz.NumberOfQuestions; QuestionNumber++)
    {
        PrintTheQuestion(Quiz, QuestionNumber);

        Quiz.QuestionList[QuestionNumber].PlayerAnswer = ReadQuestionAnswer();

        CorrectTheQuestionAnswer(Quiz, QuestionNumber);
    }

    Quiz.isPass = (Quiz.RightAnswers >= Quiz.WrongAnswers);
}

string GetFinalResultText(bool Pass)
{
    if (Pass)
        return "PASS :-)";
    else
        return "FAIL :-(";
}

void PrintQuizResult(stQuiz Quiz)
{
    SetScreenColor(Quiz.isPass);

    cout << "\n";
    cout << "\n\n";
    cout << " Final Result is " << GetFinalResultText(Quiz.isPass);
    cout << "\n__\n\n";

    cout << "Number of Questions: " << Quiz.NumberOfQuestions << endl;
    cout << "Questions Level: " << QuestionLevelName(Quiz.QuestionsLevel) << endl;
    cout << "Operation Type: " << GetOperationSymbol(Quiz.OperType) << endl;
    cout << "Number of Right answers: " << Quiz.RightAnswers << endl;
    cout << "Number of Wrong answers: " << Quiz.WrongAnswers << endl;

    cout << "\n\n";
}

void PlayMathGame()
{
    stQuiz Quiz;

    Quiz.NumberOfQuestions = ReadHowManyQuestions();
    Quiz.QuestionsLevel = ReadQuestionLevel();
    Quiz.OperType = ReadOpType();

    GenerateQuizQuestion(Quiz);
    AskAndCorrectQuestionListAnswers(Quiz);
    PrintQuizResult(Quiz);
}

void ResetScreen()
{
    system("cls");
    system("color 0F");
}

void StartGame()
{
    char PlayAgain = 'Y';

    do
    {
        ResetScreen();
        PlayMathGame();

        cout << "\n" << "Do you want to play again? Y/N? ";
        cin >> PlayAgain;

    } while (PlayAgain == 'Y' || PlayAgain == 'y');
}

int main()
{
    srand((unsigned)time(NULL));

    StartGame();

    return 0;
}