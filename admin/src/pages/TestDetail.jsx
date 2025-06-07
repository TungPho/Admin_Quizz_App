import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBackSharp, IoTimeOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { GoCheck } from "react-icons/go";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const TestDetail = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const BACK_END_LOCAL_URL = import.meta.env.VITE_LOCAL_API_CALL_URL;

  // State management
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestDetail = async () => {
      try {
        setLoading(true);

        // Fetch test information
        const testResponse = await fetch(
          `https://backend-quizz-deploy.onrender.com/api/v1/tests/${testId}`
        );

        if (!testResponse.ok) {
          throw new Error("Unable to load test information");
        }

        const testData = await testResponse.json();
        console.log("Test data:", testData.metadata);
        setTest(testData.metadata);

        // Fetch all questions for this test
        if (
          testData.metadata.questions &&
          testData.metadata.questions.length > 0
        ) {
          const questionPromises = testData.metadata.questions.map(
            async (questionID) => {
              try {
                const questionResponse = await fetch(
                  `https://backend-quizz-deploy.onrender.com/api/v1/questions/${questionID}`
                );

                if (questionResponse.ok) {
                  const questionData = await questionResponse.json();
                  return questionData.metadata;
                }
                return null;
              } catch (error) {
                console.error(`Error fetching question ${questionID}:`, error);
                return null;
              }
            }
          );

          const allQuestions = await Promise.all(questionPromises);
          // Filter out null questions (failed requests)
          const validQuestions = allQuestions.filter((q) => q !== null);
          setQuestions(validQuestions);
        }
      } catch (error) {
        console.error("Error fetching test details:", error);
        setError(error.message);
        toast.error("Error loading test details!");
      } finally {
        setLoading(false);
      }
    };

    if (testId) {
      fetchTestDetail();
    }
  }, [testId, BACK_END_LOCAL_URL]);

  const formatTimeLimit = (minutes) => {
    if (minutes === 0) return "No limit";
    if (minutes < 60) return `${minutes} minutes`;
    return `${Math.floor(minutes / 60)} hour${
      Math.floor(minutes / 60) > 1 ? "s" : ""
    } ${minutes % 60 > 0 ? `${minutes % 60} minutes` : ""}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleString("en-US");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading test details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Test not found"}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-3"
            aria-label="Go back"
          >
            <IoArrowBackSharp className="text-xl" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{test.title}</h1>
        </div>
        <button
          onClick={async () => {
            try {
              const response = await fetch(
                `${BACK_END_LOCAL_URL}/tests/${testId}/ban`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    isBanned: !test.isBanned,
                  }),
                }
              );

              if (response.ok) {
                const result = await response.json();
                setTest((prev) => ({ ...prev, isBanned: !prev.isBanned }));
                toast.success(
                  result.message ||
                    `Test ${
                      test.isBanned ? "unbanned" : "banned"
                    } successfully!`
                );
              } else {
                toast.error("Error updating test status!");
              }
            } catch (error) {
              console.error("Error banning/unbanning test:", error);
              toast.error("Error updating test status!");
            }
          }}
          className={`px-6 py-2 rounded-md transition-colors font-medium shadow-sm ${
            test.isBanned
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          {test.isBanned ? "Unban Test" : "Ban Test"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar - Test Information */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">
              Test Information
            </h3>

            <div className="space-y-4">
              <div className="flex items-center">
                <IoTimeOutline className="text-xl text-gray-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Time Limit</p>
                  <p className="font-medium">
                    {formatTimeLimit(test.timeLimit)}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">Total Questions</p>
                <p className="font-medium text-lg text-blue-600">
                  {questions.length} questions
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">Created Date</p>
                <p className="font-medium">{formatDate(test.createdAt)}</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">Status</p>
                <p
                  className={`font-medium ${
                    test.isBanned ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {test.isBanned ? "Banned" : "Active"}
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="font-medium">{formatDate(test.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content - Questions */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-xl text-gray-800">
                Questions List
              </h2>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {questions.length} questions
              </span>
            </div>

            {questions.length > 0 ? (
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div
                    key={question._id || index}
                    className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden"
                  >
                    <div className="bg-white p-4 border-b border-gray-200">
                      <div className="flex items-start">
                        <span className="bg-blue-500 text-white text-sm font-medium px-2 py-1 rounded mr-3 mt-0.5">
                          Q{index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium leading-relaxed">
                            {question.text}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <p className="text-sm font-medium text-gray-600 mb-3">
                        Answer Choices:
                      </p>
                      <div className="space-y-2">
                        {question.options &&
                          question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={`flex items-center p-3 rounded-md border transition-colors ${
                                option.isCorrect
                                  ? "bg-green-50 border-green-200"
                                  : "bg-white border-gray-200"
                              }`}
                            >
                              {option.isCorrect ? (
                                <GoCheck className="text-green-600 mr-3 flex-shrink-0 text-lg" />
                              ) : (
                                <IoMdClose className="text-red-500 mr-3 flex-shrink-0 text-lg" />
                              )}
                              <span className="text-gray-700 leading-relaxed">
                                {option.text}
                              </span>
                              {option.isCorrect && (
                                <span className="ml-auto bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                                  Correct Answer
                                </span>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium">No Questions Available</p>
                <p className="text-sm mt-1">
                  This test doesn't have any questions added yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDetail;
