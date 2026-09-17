require("dotenv").config();

const mongoose = require("mongoose");
const Question = require("./models/Question");
const questions = require("./data/questions");

const seedQuestions = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    // Remove existing questions
    await Question.deleteMany({});

    console.log("Old questions removed");

    // Insert new questions
    const insertedQuestions = await Question.insertMany(questions, {
      ordered: true,
    });

    console.log(`${insertedQuestions.length} questions inserted successfully`);

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("\n❌ SEEDING ERROR\n");
    console.error(error);

    if (error.writeErrors) {
      console.error("\nIndividual write errors:");

      error.writeErrors.forEach((writeError, index) => {
        console.error(`\nError ${index + 1}:`);
        console.error(writeError.errmsg || writeError.message);
      });
    }

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedQuestions();
