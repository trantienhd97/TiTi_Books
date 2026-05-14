# TÀI LI?U TÍNH ?I?M INSPECTION CLIENT-SIDE

## I. T?NG QUAN

Hàm `CalculateScore` tính ?i?m cho Inspection d?a trên:
1. **Score c?a câu tr? l?i**: L?y t? InspectionAnswerOption ho?c InspectionQuestionResponseContent
2. **Logic Conditional**: Áp d?ng các rule ?? tr? ?i?m page/section/form ho?c b? qua ?i?m
3. **Aggregation**: T?ng h?p ?i?m t? Question ? Section ? Page ? Inspection

---

## II. ENUMS VÀ INTERFACES

### 1. Enums

```typescript
// AnswerType
enum AnswerType {
    SINGLE_CHOICE = 1,
    MULTIPLE_CHOICE = 2,
    TEXT = 3,
    NUMBER = 4,
    DATETIME = 5,
    IMAGE = 6,
    INSTRUCTION = 7,
}

// QuestionType
enum QuestionType {
    QUESTION = 1,
    QUESTION_SECTION = 2,
}

// ConditionalOperator
enum ConditionalOperator {
    SINGLE_CHOICE_IS = 1,
    SINGLE_CHOICE_IS_NOT = 2,
    SINGLE_CHOICE_IS_ONE_OF = 3,
    SINGLE_CHOICE_IS_NOT_ONE_OF = 4,
    SINGLE_CHOICE_IS_SELECTED = 5,
    SINGLE_CHOICE_IS_NOT_SELECTED = 6,
    
    MULTIPLE_CHOICE_IS = 7,
    MULTIPLE_CHOICE_IS_NOT = 8,
    MULTIPLE_CHOICE_IS_ONE_OF = 9,
    MULTIPLE_CHOICE_IS_NOT_ONE_OF = 10,
    MULTIPLE_CHOICE_IS_SELECTED = 11,
    MULTIPLE_CHOICE_IS_NOT_SELECTED = 12,
    
    TEXT_IS = 13,
    TEXT_IS_NOT = 14,
    
    NUMBER_LESS = 15,
    NUMBER_LESS_EQUAL = 16,
    NUMBER_GREATER = 17,
    NUMBER_GREATER_EQUAL = 18,
    NUMBER_EQUAL = 19,
    NUMBER_NOT_EQUAL = 20,
    NUMBER_BETWEEN = 21,
    NUMBER_NOT_BETWEEN = 22,
}

// ConditionalTrigger
enum ConditionalTrigger {
    REQUIRE_ACTION = 1,
    REQUIRE_EVIDENCE = 2,
    AUTO_CREATE_ACTION = 3,
    NOTIFY = 4,
    DEDUCT_PAGE_POINT = 5,
    DEDUCT_SECTION_POINT = 6,
    DEDUCT_FORM_POINT = 7,
    IGNORE_POINT = 8,
}
```

### 2. Interfaces

```typescript
interface InspectionAnswerOption {
    id: number;
    inspectionQuestionId: number;
    answerOptionId: number;
    score?: number;
    useFlag: boolean;
}

interface InspectionQuestionResponseContent {
    id: number;
    inspectionQuestionId: number;
    questionnaireResponseSetId: number;
    questionResponseContentId: number;
    score?: number;
    useFlag: boolean;
}

interface InspectionQuestionAnswer {
    id: number;
    inspectionQuestionId: number;
    inspectionAnswerOptionId?: number;
    inspectionQuestionResponseContentId?: number;
    textValue?: string;
    numberValue?: number;
    isDeleted: boolean;
}

interface InspectionQuestionConditionalAnswerOption {
    id: number;
    inspectionQuestionConditionalId: number;
    inspectionAnswerOptionId: number;
}

interface InspectionQuestionConditionalResponseContent {
    id: number;
    inspectionQuestionConditionalId: number;
    inspectionQuestionResponseContentId: number;
}

interface InspectionQuestionConditionalContent {
    id: number;
    inspectionQuestionConditionalId: number;
    conditionalTriggerId: number;
    isRequireNote: boolean;
    isRequireMedia: boolean;
}

interface InspectionQuestionConditional {
    id: number;
    inspectionQuestionId: number;
    conditionalOperatorId: number;
    textValue?: string;
    numberValue?: number;
    numberFromValue?: number;
    numberToValue?: number;
    inspectionQuestionConditionalAnswerOptions?: InspectionQuestionConditionalAnswerOption[];
    inspectionQuestionConditionalResponseContents?: InspectionQuestionConditionalResponseContent[];
    inspectionQuestionConditionalContents?: InspectionQuestionConditionalContent[];
}

interface InspectionQuestion {
    id: number;
    inspectionId: number;
    inspectionPageId: number;
    parentId?: number;
    questionId: number;
    questionPageId: number;
    questionTypeId: number;
    answerTypeId: number;
    questionnaireResponseSetId?: number;
    useScore: boolean;
    score?: number;
    maxScore?: number;
    orderNumber: number;
    // Computed properties
    isDeductedPageScore?: boolean;
    isDeductedSectionScore?: boolean;
    isDeductedInspectionScore?: boolean;
}

interface InspectionPage {
    id: number;
    inspectionId: number;
    questionPageId: number;
    title: string;
    orderNumber: number;
    score?: number;
    maxScore?: number;
}

interface Inspection {
    id: number;
    questionnaireId: number;
    score?: number;
    maxScore?: number;
}

interface CalculateScoreInput {
    inspection: Inspection;
    inspectionPages: InspectionPage[];
    inspectionQuestions: InspectionQuestion[];
    inspectionQuestionAnswers: InspectionQuestionAnswer[];
    inspectionAnswerOptions: InspectionAnswerOption[];
    inspectionQuestionResponseContents: InspectionQuestionResponseContent[];
    inspectionQuestionConditionals: InspectionQuestionConditional[];
}

interface CalculateScoreResult {
    inspection: Inspection;
    inspectionPages: InspectionPage[];
    inspectionQuestions: InspectionQuestion[];
}
```

---

## III. HÀM TÍNH ?I?M CHÍNH

### File: InspectionScoreCalculator.ts

```typescript
export class InspectionScoreCalculator {
    
    /**
     * Hàm tính ?i?m cho toàn b? Inspection
     */
    calculateScore(input: CalculateScoreInput): CalculateScoreResult {
        const {
            inspection,
            inspectionPages,
            inspectionQuestions,
            inspectionQuestionAnswers,
            inspectionAnswerOptions,
            inspectionQuestionResponseContents,
            inspectionQuestionConditionals
        } = input;

        // Check n?u không có câu h?i nào dùng UseScore
        const hasUseScore = inspectionQuestions.some(q => q.useScore === true);
        if (!hasUseScore) {
            return { inspection, inspectionPages, inspectionQuestions };
        }

        // Clone data ?? tránh mutate input
        const clonedPages = JSON.parse(JSON.stringify(inspectionPages)) as InspectionPage[];
        const clonedQuestions = JSON.parse(JSON.stringify(inspectionQuestions)) as InspectionQuestion[];
        const clonedInspection = JSON.parse(JSON.stringify(inspection)) as Inspection;

        // Tính ?i?m cho t?ng page
        for (const page of clonedPages) {
            // L?y t?t c? questions trong page này (ch? l?y QUESTION, không l?y SECTION)
            const questionsInPage = clonedQuestions
                .filter(q => q.inspectionPageId === page.id && q.questionTypeId === QuestionType.QUESTION);

            for (const question of questionsInPage) {
                if (question.useScore) {
                    // Tính ?i?m cho question
                    this.calculateQuestionScore(
                        question,
                        inspectionQuestionAnswers,
                        inspectionAnswerOptions,
                        inspectionQuestionResponseContents,
                        inspectionQuestionConditionals
                    );
                } else {
                    question.score = undefined;
                }
            }

            // Tính ?i?m cho các sections trong page
            const sectionsInPage = clonedQuestions
                .filter(q => q.questionPageId === page.questionPageId && q.questionTypeId === QuestionType.QUESTION_SECTION);

            for (const section of sectionsInPage) {
                // L?y t?t c? questions con c?a section
                const questionsInSection = questionsInPage.filter(q => q.parentId === section.id);

                // Ki?m tra có question nào b? tr? ?i?m section không
                const hasDeductedSection = questionsInSection.some(q => q.isDeductedSectionScore);

                if (hasDeductedSection) {
                    section.score = 0;
                } else {
                    section.score = questionsInSection
                        .filter(q => q.score !== undefined && q.score !== null)
                        .reduce((sum, q) => sum + q.score!, 0);
                    section.score = section.score < 0 ? 0 : section.score;

                    section.maxScore = questionsInSection
                        .filter(q => q.maxScore !== undefined && q.maxScore !== null)
                        .reduce((sum, q) => sum + q.maxScore!, 0);
                    section.maxScore = section.maxScore < 0 ? 0 : section.maxScore;
                }
            }

            // Tính ?i?m cho page
            const hasDeductedPage = questionsInPage.some(q => q.isDeductedPageScore);

            if (hasDeductedPage) {
                page.score = 0;
            } else {
                // ?i?m page = t?ng ?i?m questions (parent = null) + t?ng ?i?m sections
                const scoreOfQuestionsInPage = questionsInPage
                    .filter(q => q.parentId === undefined || q.parentId === null)
                    .filter(q => q.score !== undefined && q.score !== null)
                    .reduce((sum, q) => sum + q.score!, 0);

                const scoreOfSectionsInPage = sectionsInPage
                    .filter(s => s.score !== undefined && s.score !== null)
                    .reduce((sum, s) => sum + s.score!, 0);

                page.score = scoreOfQuestionsInPage + scoreOfSectionsInPage;
                page.score = page.score < 0 ? 0 : page.score;

                // Max score
                const maxScoreOfQuestionsInPage = questionsInPage
                    .filter(q => q.parentId === undefined || q.parentId === null)
                    .filter(q => q.maxScore !== undefined && q.maxScore !== null)
                    .reduce((sum, q) => sum + q.maxScore!, 0);

                const maxScoreOfSectionsInPage = sectionsInPage
                    .filter(s => s.maxScore !== undefined && s.maxScore !== null)
                    .reduce((sum, s) => sum + s.maxScore!, 0);

                page.maxScore = maxScoreOfQuestionsInPage + maxScoreOfSectionsInPage;
                page.maxScore = page.maxScore < 0 ? 0 : page.maxScore;
            }
        }

        // Tính ?i?m cho Inspection
        const hasDeductedInspection = clonedQuestions.some(q => q.isDeductedInspectionScore);

        if (hasDeductedInspection) {
            clonedInspection.score = 0;
        } else {
            clonedInspection.score = clonedPages
                .filter(p => p.score !== undefined && p.score !== null)
                .reduce((sum, p) => sum + p.score!, 0);
            clonedInspection.score = clonedInspection.score < 0 ? 0 : clonedInspection.score;

            clonedInspection.maxScore = clonedPages
                .filter(p => p.maxScore !== undefined && p.maxScore !== null)
                .reduce((sum, p) => sum + p.maxScore!, 0);
            clonedInspection.maxScore = clonedInspection.maxScore < 0 ? 0 : clonedInspection.maxScore;
        }

        return {
            inspection: clonedInspection,
            inspectionPages: clonedPages,
            inspectionQuestions: clonedQuestions
        };
    }

    /**
     * Tính ?i?m cho 1 InspectionQuestion
     */
    private calculateQuestionScore(
        question: InspectionQuestion,
        allAnswers: InspectionQuestionAnswer[],
        allAnswerOptions: InspectionAnswerOption[],
        allResponseContents: InspectionQuestionResponseContent[],
        allConditionals: InspectionQuestionConditional[]
    ): void {
        // L?y các answers c?a question này
        const answers = allAnswers.filter(a => 
            a.inspectionQuestionId === question.id && !a.isDeleted
        );

        // Tính ?i?m d?a vào AnswerType
        if (question.answerTypeId === AnswerType.SINGLE_CHOICE) {
            if (!question.questionnaireResponseSetId) {
                // Dùng InspectionAnswerOption
                const answerOptionIds = answers
                    .filter(a => a.inspectionAnswerOptionId)
                    .map(a => a.inspectionAnswerOptionId!);

                question.score = allAnswerOptions
                    .filter(ao => answerOptionIds.includes(ao.id) && ao.score !== undefined && ao.score !== null)
                    .map(ao => ao.score!)
                    .reduce((max, score) => Math.max(max, score), 0);
            } else {
                // Dùng InspectionQuestionResponseContent
                const responseContentIds = answers
                    .filter(a => a.inspectionQuestionResponseContentId)
                    .map(a => a.inspectionQuestionResponseContentId!);

                question.score = allResponseContents
                    .filter(rc => responseContentIds.includes(rc.id) && rc.score !== undefined && rc.score !== null)
                    .map(rc => rc.score!)
                    .reduce((max, score) => Math.max(max, score), 0);
            }
        } else if (question.answerTypeId === AnswerType.MULTIPLE_CHOICE) {
            if (!question.questionnaireResponseSetId) {
                // Dùng InspectionAnswerOption (sum)
                const answerOptionIds = answers
                    .filter(a => a.inspectionAnswerOptionId)
                    .map(a => a.inspectionAnswerOptionId!);

                question.score = allAnswerOptions
                    .filter(ao => answerOptionIds.includes(ao.id) && ao.score !== undefined && ao.score !== null)
                    .reduce((sum, ao) => sum + ao.score!, 0);
            } else {
                // Dùng InspectionQuestionResponseContent (sum)
                const responseContentIds = answers
                    .filter(a => a.inspectionQuestionResponseContentId)
                    .map(a => a.inspectionQuestionResponseContentId!);

                question.score = allResponseContents
                    .filter(rc => responseContentIds.includes(rc.id) && rc.score !== undefined && rc.score !== null)
                    .reduce((sum, rc) => sum + rc.score!, 0);
            }
        }

        // Ki?m tra các conditional logic ?? ?ánh d?u tr? ?i?m
        this.checkConditionalLogic(
            question,
            answers,
            allConditionals
        );
    }

    /**
     * Ki?m tra logic conditional ?? ?ánh d?u tr? ?i?m
     */
    private checkConditionalLogic(
        question: InspectionQuestion,
        answers: InspectionQuestionAnswer[],
        allConditionals: InspectionQuestionConditional[]
    ): void {
        let isDeductedPageScore = false;
        let isDeductedSectionScore = false;
        let isDeductedInspectionScore = false;
        let isIgnoreScore = false;

        // L?y conditionals c?a question này
        const conditionals = allConditionals.filter(c => c.inspectionQuestionId === question.id);

        if (!conditionals || conditionals.length === 0) {
            return;
        }

        for (const conditional of conditionals) {
            if (!conditional.inspectionQuestionConditionalContents) continue;

            // L?c ra các conditional contents liên quan ??n tr? ?i?m
            const triggerContents = conditional.inspectionQuestionConditionalContents.filter(c =>
                c.conditionalTriggerId === ConditionalTrigger.DEDUCT_PAGE_POINT ||
                c.conditionalTriggerId === ConditionalTrigger.DEDUCT_SECTION_POINT ||
                c.conditionalTriggerId === ConditionalTrigger.DEDUCT_FORM_POINT ||
                c.conditionalTriggerId === ConditionalTrigger.IGNORE_POINT
            );

            if (triggerContents.length === 0) continue;

            // ?ánh giá ?i?u ki?n
            const isConditionMet = this.evaluateConditional(question, conditional, answers);

            if (isConditionMet) {
                for (const content of triggerContents) {
                    if (content.conditionalTriggerId === ConditionalTrigger.DEDUCT_PAGE_POINT) {
                        isDeductedPageScore = true;
                    } else if (content.conditionalTriggerId === ConditionalTrigger.DEDUCT_SECTION_POINT) {
                        isDeductedSectionScore = true;
                    } else if (content.conditionalTriggerId === ConditionalTrigger.DEDUCT_FORM_POINT) {
                        isDeductedInspectionScore = true;
                    } else if (content.conditionalTriggerId === ConditionalTrigger.IGNORE_POINT) {
                        isIgnoreScore = true;
                    }
                }
            }
        }

        question.isDeductedPageScore = isDeductedPageScore;
        question.isDeductedSectionScore = isDeductedSectionScore;
        question.isDeductedInspectionScore = isDeductedInspectionScore;

        // N?u ignore score thì set score và maxScore = 0
        if (isIgnoreScore && question.maxScore !== undefined) {
            question.score = 0;
            question.maxScore = 0;
        }
    }

    /**
     * ?ánh giá ?i?u ki?n conditional
     */
    private evaluateConditional(
        question: InspectionQuestion,
        conditional: InspectionQuestionConditional,
        answers: InspectionQuestionAnswer[]
    ): boolean {
        if (question.answerTypeId === AnswerType.SINGLE_CHOICE) {
            return this.evaluateSingleChoice(conditional, answers, question.questionnaireResponseSetId);
        } else if (question.answerTypeId === AnswerType.MULTIPLE_CHOICE) {
            return this.evaluateMultipleChoice(conditional, answers, question.questionnaireResponseSetId);
        } else if (question.answerTypeId === AnswerType.TEXT) {
            return this.evaluateText(conditional, answers);
        } else if (question.answerTypeId === AnswerType.NUMBER) {
            return this.evaluateNumber(conditional, answers);
        }

        return false;
    }

    /**
     * ?ánh giá SINGLE_CHOICE
     */
    private evaluateSingleChoice(
        conditional: InspectionQuestionConditional,
        answers: InspectionQuestionAnswer[],
        questionnaireResponseSetId?: number
    ): boolean {
        if (!questionnaireResponseSetId) {
            // Dùng InspectionAnswerOption
            const chosenOptionId = answers.find(a => a.inspectionAnswerOptionId)?.inspectionAnswerOptionId;
            const conditionalOptionIds = conditional.inspectionQuestionConditionalAnswerOptions?.map(x => x.inspectionAnswerOptionId) || [];
            const conditionalOptionId = conditionalOptionIds[0];

            switch (conditional.conditionalOperatorId) {
                case ConditionalOperator.SINGLE_CHOICE_IS:
                    return chosenOptionId === conditionalOptionId;
                case ConditionalOperator.SINGLE_CHOICE_IS_NOT:
                    return chosenOptionId !== conditionalOptionId;
                case ConditionalOperator.SINGLE_CHOICE_IS_ONE_OF:
                    return chosenOptionId ? conditionalOptionIds.includes(chosenOptionId) : false;
                case ConditionalOperator.SINGLE_CHOICE_IS_NOT_ONE_OF:
                    return chosenOptionId ? !conditionalOptionIds.includes(chosenOptionId) : true;
                case ConditionalOperator.SINGLE_CHOICE_IS_SELECTED:
                    return chosenOptionId !== undefined && chosenOptionId !== null;
                case ConditionalOperator.SINGLE_CHOICE_IS_NOT_SELECTED:
                    return chosenOptionId === undefined || chosenOptionId === null;
                default:
                    return false;
            }
        } else {
            // Dùng InspectionQuestionResponseContent
            const chosenContentId = answers.find(a => a.inspectionQuestionResponseContentId)?.inspectionQuestionResponseContentId;
            const conditionalContentIds = conditional.inspectionQuestionConditionalResponseContents?.map(x => x.inspectionQuestionResponseContentId) || [];
            const conditionalContentId = conditionalContentIds[0];

            switch (conditional.conditionalOperatorId) {
                case ConditionalOperator.SINGLE_CHOICE_IS:
                    return chosenContentId === conditionalContentId;
                case ConditionalOperator.SINGLE_CHOICE_IS_NOT:
                    return chosenContentId !== conditionalContentId;
                case ConditionalOperator.SINGLE_CHOICE_IS_ONE_OF:
                    return chosenContentId ? conditionalContentIds.includes(chosenContentId) : false;
                case ConditionalOperator.SINGLE_CHOICE_IS_NOT_ONE_OF:
                    return chosenContentId ? !conditionalContentIds.includes(chosenContentId) : true;
                case ConditionalOperator.SINGLE_CHOICE_IS_SELECTED:
                    return chosenContentId !== undefined && chosenContentId !== null;
                case ConditionalOperator.SINGLE_CHOICE_IS_NOT_SELECTED:
                    return chosenContentId === undefined || chosenContentId === null;
                default:
                    return false;
            }
        }
    }

    /**
     * ?ánh giá MULTIPLE_CHOICE
     */
    private evaluateMultipleChoice(
        conditional: InspectionQuestionConditional,
        answers: InspectionQuestionAnswer[],
        questionnaireResponseSetId?: number
    ): boolean {
        if (!questionnaireResponseSetId) {
            // Dùng InspectionAnswerOption
            const chosenOptionIds = answers
                .filter(a => a.inspectionAnswerOptionId)
                .map(a => a.inspectionAnswerOptionId!);
            const conditionalOptionIds = conditional.inspectionQuestionConditionalAnswerOptions?.map(x => x.inspectionAnswerOptionId) || [];

            switch (conditional.conditionalOperatorId) {
                case ConditionalOperator.MULTIPLE_CHOICE_IS: {
                    const diff1 = chosenOptionIds.filter(x => !conditionalOptionIds.includes(x));
                    const diff2 = conditionalOptionIds.filter(x => !chosenOptionIds.includes(x));
                    return diff1.length === 0 && diff2.length === 0;
                }
                case ConditionalOperator.MULTIPLE_CHOICE_IS_NOT: {
                    const diff1 = chosenOptionIds.filter(x => !conditionalOptionIds.includes(x));
                    const diff2 = conditionalOptionIds.filter(x => !chosenOptionIds.includes(x));
                    return diff1.length > 0 || diff2.length > 0;
                }
                case ConditionalOperator.MULTIPLE_CHOICE_IS_ONE_OF: {
                    const intersection = chosenOptionIds.filter(x => conditionalOptionIds.includes(x));
                    return intersection.length > 0;
                }
                case ConditionalOperator.MULTIPLE_CHOICE_IS_NOT_ONE_OF: {
                    const intersection = chosenOptionIds.filter(x => conditionalOptionIds.includes(x));
                    return intersection.length === 0;
                }
                case ConditionalOperator.MULTIPLE_CHOICE_IS_SELECTED:
                    return chosenOptionIds.length > 0;
                case ConditionalOperator.MULTIPLE_CHOICE_IS_NOT_SELECTED:
                    return chosenOptionIds.length === 0;
                default:
                    return false;
            }
        } else {
            // Dùng InspectionQuestionResponseContent
            const chosenContentIds = answers
                .filter(a => a.inspectionQuestionResponseContentId)
                .map(a => a.inspectionQuestionResponseContentId!);
            const conditionalContentIds = conditional.inspectionQuestionConditionalResponseContents?.map(x => x.inspectionQuestionResponseContentId) || [];

            switch (conditional.conditionalOperatorId) {
                case ConditionalOperator.MULTIPLE_CHOICE_IS: {
                    const diff1 = chosenContentIds.filter(x => !conditionalContentIds.includes(x));
                    const diff2 = conditionalContentIds.filter(x => !chosenContentIds.includes(x));
                    return diff1.length === 0 && diff2.length === 0;
                }
                case ConditionalOperator.MULTIPLE_CHOICE_IS_NOT: {
                    const diff1 = chosenContentIds.filter(x => !conditionalContentIds.includes(x));
                    const diff2 = conditionalContentIds.filter(x => !chosenContentIds.includes(x));
                    return diff1.length > 0 || diff2.length > 0;
                }
                case ConditionalOperator.MULTIPLE_CHOICE_IS_ONE_OF: {
                    const intersection = chosenContentIds.filter(x => conditionalContentIds.includes(x));
                    return intersection.length > 0;
                }
                case ConditionalOperator.MULTIPLE_CHOICE_IS_NOT_ONE_OF: {
                    const intersection = chosenContentIds.filter(x => conditionalContentIds.includes(x));
                    return intersection.length === 0;
                }
                case ConditionalOperator.MULTIPLE_CHOICE_IS_SELECTED:
                    return chosenContentIds.length > 0;
                case ConditionalOperator.MULTIPLE_CHOICE_IS_NOT_SELECTED:
                    return chosenContentIds.length === 0;
                default:
                    return false;
            }
        }
    }

    /**
     * ?ánh giá TEXT
     */
    private evaluateText(
        conditional: InspectionQuestionConditional,
        answers: InspectionQuestionAnswer[]
    ): boolean {
        const textValue = answers.find(a => a.textValue)?.textValue;

        switch (conditional.conditionalOperatorId) {
            case ConditionalOperator.TEXT_IS:
                return !!(textValue && conditional.textValue && textValue.includes(conditional.textValue));
            case ConditionalOperator.TEXT_IS_NOT:
                return !textValue || !conditional.textValue || !textValue.includes(conditional.textValue);
            default:
                return false;
        }
    }

    /**
     * ?ánh giá NUMBER
     */
    private evaluateNumber(
        conditional: InspectionQuestionConditional,
        answers: InspectionQuestionAnswer[]
    ): boolean {
        const numberValue = answers.find(a => a.numberValue !== undefined)?.numberValue;

        if (numberValue === undefined || numberValue === null) {
            return false;
        }

        switch (conditional.conditionalOperatorId) {
            case ConditionalOperator.NUMBER_LESS:
                return conditional.numberValue !== undefined && numberValue < conditional.numberValue;
            case ConditionalOperator.NUMBER_LESS_EQUAL:
                return conditional.numberValue !== undefined && numberValue <= conditional.numberValue;
            case ConditionalOperator.NUMBER_GREATER:
                return conditional.numberValue !== undefined && numberValue > conditional.numberValue;
            case ConditionalOperator.NUMBER_GREATER_EQUAL:
                return conditional.numberValue !== undefined && numberValue >= conditional.numberValue;
            case ConditionalOperator.NUMBER_EQUAL:
                return conditional.numberValue !== undefined && numberValue === conditional.numberValue;
            case ConditionalOperator.NUMBER_NOT_EQUAL:
                return conditional.numberValue !== undefined && numberValue !== conditional.numberValue;
            case ConditionalOperator.NUMBER_BETWEEN:
                return conditional.numberFromValue !== undefined && 
                       conditional.numberToValue !== undefined &&
                       conditional.numberFromValue <= numberValue && 
                       numberValue <= conditional.numberToValue;
            case ConditionalOperator.NUMBER_NOT_BETWEEN:
                return conditional.numberFromValue !== undefined && 
                       conditional.numberToValue !== undefined &&
                       (numberValue < conditional.numberFromValue || numberValue > conditional.numberToValue);
            default:
                return false;
        }
    }
}
```

---

## IV. USAGE EXAMPLES

### Example 1: Basic Usage

```typescript
import { InspectionScoreCalculator } from './InspectionScoreCalculator';

// Gi? s? b?n có inspection data t? API/state
const inspectionData = {
    inspection: { id: 1, questionnaireId: 10, score: 0, maxScore: 0 },
    inspectionPages: [
        { id: 1, inspectionId: 1, questionPageId: 1, title: "Page 1", orderNumber: 1, score: 0, maxScore: 0 }
    ],
    inspectionQuestions: [
        {
            id: 1,
            inspectionId: 1,
            inspectionPageId: 1,
            questionId: 100,
            questionPageId: 1,
            questionTypeId: QuestionType.QUESTION,
            answerTypeId: AnswerType.SINGLE_CHOICE,
            questionnaireResponseSetId: undefined,
            useScore: true,
            score: 0,
            maxScore: 10,
            orderNumber: 1
        }
    ],
    inspectionQuestionAnswers: [
        {
            id: 1,
            inspectionQuestionId: 1,
            inspectionAnswerOptionId: 5,
            isDeleted: false
        }
    ],
    inspectionAnswerOptions: [
        { id: 5, inspectionQuestionId: 1, answerOptionId: 50, score: 8, useFlag: true }
    ],
    inspectionQuestionResponseContents: [],
    inspectionQuestionConditionals: []
};

// Tính ?i?m
const calculator = new InspectionScoreCalculator();
const result = calculator.calculateScore(inspectionData);

console.log('Inspection Score:', result.inspection.score); // 8
console.log('Inspection Max Score:', result.inspection.maxScore); // 10
console.log('Page Scores:', result.inspectionPages.map(p => ({ title: p.title, score: p.score })));
```

### Example 2: With Conditionals (Deduct Points)

```typescript
const inspectionDataWithConditional = {
    inspection: { id: 1, questionnaireId: 10, score: 0, maxScore: 0 },
    inspectionPages: [
        { id: 1, inspectionId: 1, questionPageId: 1, title: "Safety Check", orderNumber: 1 }
    ],
    inspectionQuestions: [
        {
            id: 1,
            inspectionId: 1,
            inspectionPageId: 1,
            questionId: 100,
            questionPageId: 1,
            questionTypeId: QuestionType.QUESTION,
            answerTypeId: AnswerType.SINGLE_CHOICE,
            useScore: true,
            score: 0,
            maxScore: 10,
            orderNumber: 1
        }
    ],
    inspectionQuestionAnswers: [
        {
            id: 1,
            inspectionQuestionId: 1,
            inspectionAnswerOptionId: 5, // Ch?n ?áp án "Không ??t"
            isDeleted: false
        }
    ],
    inspectionAnswerOptions: [
        { id: 5, inspectionQuestionId: 1, answerOptionId: 50, score: 0, useFlag: true }
    ],
    inspectionQuestionResponseContents: [],
    inspectionQuestionConditionals: [
        {
            id: 1,
            inspectionQuestionId: 1,
            conditionalOperatorId: ConditionalOperator.SINGLE_CHOICE_IS,
            inspectionQuestionConditionalAnswerOptions: [
                { id: 1, inspectionQuestionConditionalId: 1, inspectionAnswerOptionId: 5 }
            ],
            inspectionQuestionConditionalResponseContents: [],
            inspectionQuestionConditionalContents: [
                {
                    id: 1,
                    inspectionQuestionConditionalId: 1,
                    conditionalTriggerId: ConditionalTrigger.DEDUCT_PAGE_POINT,
                    isRequireNote: false,
                    isRequireMedia: false
                }
            ]
        }
    ]
};

const calculator = new InspectionScoreCalculator();
const result = calculator.calculateScore(inspectionDataWithConditional);

console.log('Page Score:', result.inspectionPages[0].score); // 0 (vì b? tr? ?i?m page)
console.log('Question isDeductedPageScore:', result.inspectionQuestions[0].isDeductedPageScore); // true
```

### Example 3: With Question Section

```typescript
const inspectionDataWithSection = {
    inspection: { id: 1, questionnaireId: 10 },
    inspectionPages: [
        { id: 1, inspectionId: 1, questionPageId: 1, title: "Safety", orderNumber: 1 }
    ],
    inspectionQuestions: [
        // Section
        {
            id: 1,
            inspectionId: 1,
            inspectionPageId: 1,
            questionId: 100,
            questionPageId: 1,
            questionTypeId: QuestionType.QUESTION_SECTION,
            answerTypeId: AnswerType.SINGLE_CHOICE,
            useScore: false,
            score: 0,
            maxScore: 0,
            orderNumber: 1
        },
        // Question con c?a section
        {
            id: 2,
            inspectionId: 1,
            inspectionPageId: 1,
            parentId: 1, // thu?c section id=1
            questionId: 101,
            questionPageId: 1,
            questionTypeId: QuestionType.QUESTION,
            answerTypeId: AnswerType.SINGLE_CHOICE,
            useScore: true,
            score: 0,
            maxScore: 10,
            orderNumber: 1
        }
    ],
    inspectionQuestionAnswers: [
        {
            id: 1,
            inspectionQuestionId: 2,
            inspectionAnswerOptionId: 5,
            isDeleted: false
        }
    ],
    inspectionAnswerOptions: [
        { id: 5, inspectionQuestionId: 2, answerOptionId: 50, score: 7, useFlag: true }
    ],
    inspectionQuestionResponseContents: [],
    inspectionQuestionConditionals: []
};

const calculator = new InspectionScoreCalculator();
const result = calculator.calculateScore(inspectionDataWithSection);

console.log('Section Score:', result.inspectionQuestions[0].score); // 7 (t?ng ?i?m câu con)
console.log('Question Score:', result.inspectionQuestions[1].score); // 7
console.log('Page Score:', result.inspectionPages[0].score); // 7
```

---

## V. INTEGRATION VÀO ANGULAR/REACT/VUE

### Angular Service

```typescript
// inspection-score.service.ts
import { Injectable } from '@angular/core';
import { InspectionScoreCalculator } from './InspectionScoreCalculator';

@Injectable({
    providedIn: 'root'
})
export class InspectionScoreService {
    private calculator = new InspectionScoreCalculator();
    
    calculateInspectionScore(inspectionData: CalculateScoreInput): CalculateScoreResult {
        return this.calculator.calculateScore(inspectionData);
    }
}

// Component usage
export class InspectionDetailComponent {
    constructor(private scoreService: InspectionScoreService) {}
    
    onFinish() {
        // Tr??c khi g?i API finish, tính ?i?m tr??c
        const result = this.scoreService.calculateInspectionScore({
            inspection: this.inspection,
            inspectionPages: this.inspectionPages,
            inspectionQuestions: this.inspectionQuestions,
            inspectionQuestionAnswers: this.inspectionQuestionAnswers,
            inspectionAnswerOptions: this.inspectionAnswerOptions,
            inspectionQuestionResponseContents: this.inspectionQuestionResponseContents,
            inspectionQuestionConditionals: this.inspectionQuestionConditionals
        });
        
        // C?p nh?t l?i state
        this.inspection = result.inspection;
        this.inspectionPages = result.inspectionPages;
        this.inspectionQuestions = result.inspectionQuestions;
        
        // Hi?n th? cho user xem tr??c
        console.log('?i?m d? ki?n:', result.inspection.score, '/', result.inspection.maxScore);
        
        // G?i API finish v?i d? li?u ?ã tính ?i?m
        this.api.finishInspection(this.inspection).subscribe(...);
    }
}
```

### React Hook

```typescript
// useInspectionScore.ts
import { useMemo } from 'react';
import { InspectionScoreCalculator } from './InspectionScoreCalculator';

export function useInspectionScore(inspectionData: CalculateScoreInput | null) {
    const calculator = useMemo(() => new InspectionScoreCalculator(), []);
    
    const result = useMemo(() => {
        if (!inspectionData) return null;
        return calculator.calculateScore(inspectionData);
    }, [inspectionData, calculator]);
    
    return result;
}

// Component usage
function InspectionDetailComponent() {
    const [inspectionData, setInspectionData] = useState<CalculateScoreInput | null>(null);
    const calculatedScore = useInspectionScore(inspectionData);
    
    const handleFinish = async () => {
        if (!calculatedScore) return;
        
        console.log('Score:', calculatedScore.inspection.score);
        
        // Call API
        await api.finishInspection(calculatedScore.inspection);
    };
    
    return (
        <div>
            <h3>?i?m: {calculatedScore?.inspection.score ?? 0} / {calculatedScore?.inspection.maxScore ?? 0}</h3>
            <button onClick={handleFinish}>Hoàn thành</button>
        </div>
    );
}
```

### Vue 3 Composable

```typescript
// useInspectionScore.ts
import { computed } from 'vue';
import { InspectionScoreCalculator } from './InspectionScoreCalculator';

export function useInspectionScore(inspectionData: Ref<CalculateScoreInput | null>) {
    const calculator = new InspectionScoreCalculator();
    
    const calculatedScore = computed(() => {
        if (!inspectionData.value) return null;
        return calculator.calculateScore(inspectionData.value);
    });
    
    return {
        calculatedScore
    };
}

// Component usage
<script setup lang="ts">
import { ref } from 'vue';
import { useInspectionScore } from './useInspectionScore';

const inspectionData = ref<CalculateScoreInput | null>(null);
const { calculatedScore } = useInspectionScore(inspectionData);

async function handleFinish() {
    if (!calculatedScore.value) return;
    
    console.log('Score:', calculatedScore.value.inspection.score);
    
    await api.finishInspection(calculatedScore.value.inspection);
}
</script>

<template>
    <div>
        <h3>?i?m: {{ calculatedScore?.inspection.score ?? 0 }} / {{ calculatedScore?.inspection.maxScore ?? 0 }}</h3>
        <button @click="handleFinish">Hoàn thành</button>
    </div>
</template>
```

---

## VI. L?U Ý QUAN TR?NG

### 1. Data Consistency

??m b?o data t? API/state ph?i ??y ??:
- **inspectionQuestions** ph?i có ??y ?? các questions (bao g?m section và questions con)
- **inspectionQuestionAnswers** ch? l?y nh?ng answer **không b? xóa** (isDeleted = false)
- **inspectionQuestionConditionals** ph?i load ??y ?? conditionals v?i các nested objects

### 2. Performance

V?i inspection có nhi?u câu h?i (>100):
- Ch? tính ?i?m khi c?n (tr??c khi finish, ho?c khi user request xem preview)
- Không tính ?i?m sau m?i l?n user tr? l?i câu h?i (s? lag)
- Cache k?t qu? n?u data không thay ??i

```typescript
// Angular v?i memoization
@Component({ ... })
export class InspectionDetailComponent {
    private lastCalculatedHash: string = '';
    private cachedResult: CalculateScoreResult | null = null;
    
    getScore(): CalculateScoreResult {
        const currentHash = this.calculateDataHash();
        
        if (currentHash === this.lastCalculatedHash && this.cachedResult) {
            return this.cachedResult;
        }
        
        this.cachedResult = this.scoreService.calculateInspectionScore(this.inspectionData);
        this.lastCalculatedHash = currentHash;
        
        return this.cachedResult;
    }
    
    private calculateDataHash(): string {
        return JSON.stringify({
            answers: this.inspectionQuestionAnswers,
            questions: this.inspectionQuestions.map(q => q.id)
        });
    }
}
```

### 3. Validation Before Calculate

Tr??c khi tính ?i?m, validate data:

```typescript
function validateBeforeCalculate(input: CalculateScoreInput): boolean {
    if (!input.inspection) return false;
    if (!input.inspectionPages || input.inspectionPages.length === 0) return false;
    if (!input.inspectionQuestions || input.inspectionQuestions.length === 0) return false;
    
    // Check references
    for (const question of input.inspectionQuestions) {
        const pageExists = input.inspectionPages.some(p => p.id === question.inspectionPageId);
        if (!pageExists) {
            console.error(`Question ${question.id} references non-existing page ${question.inspectionPageId}`);
            return false;
        }
    }
    
    return true;
}
```

### 4. Error Handling

```typescript
try {
    const result = calculator.calculateScore(inspectionData);
    console.log('Calculated score:', result.inspection.score);
} catch (error) {
    console.error('Failed to calculate score:', error);
    // Hi?n th? thông báo l?i cho user
    this.notificationService.error('Không th? tính ?i?m inspection. Vui lòng th? l?i.');
}
```

### 5. Debugging

Thêm logging ?? debug:

```typescript
export class InspectionScoreCalculator {
    private debug = false;
    
    constructor(debug: boolean = false) {
        this.debug = debug;
    }
    
    private calculateQuestionScore(...): void {
        // ...
        if (this.debug) {
            console.log(`Question ${question.id}: score=${question.score}, maxScore=${question.maxScore}`);
            console.log(`  - isDeductedPageScore: ${question.isDeductedPageScore}`);
            console.log(`  - isDeductedSectionScore: ${question.isDeductedSectionScore}`);
            console.log(`  - isDeductedInspectionScore: ${question.isDeductedInspectionScore}`);
        }
    }
}

// Usage
const calculator = new InspectionScoreCalculator(true); // Enable debug
```

---

## VII. TEST CASES

```typescript
describe('InspectionScoreCalculator', () => {
    let calculator: InspectionScoreCalculator;
    
    beforeEach(() => {
        calculator = new InspectionScoreCalculator();
    });
    
    test('should calculate single choice score correctly', () => {
        const input: CalculateScoreInput = {
            inspection: { id: 1, questionnaireId: 1, score: 0, maxScore: 0 },
            inspectionPages: [{ id: 1, inspectionId: 1, questionPageId: 1, title: 'P1', orderNumber: 1 }],
            inspectionQuestions: [{
                id: 1,
                inspectionId: 1,
                inspectionPageId: 1,
                questionId: 1,
                questionPageId: 1,
                questionTypeId: QuestionType.QUESTION,
                answerTypeId: AnswerType.SINGLE_CHOICE,
                useScore: true,
                maxScore: 10,
                orderNumber: 1
            }],
            inspectionQuestionAnswers: [{
                id: 1,
                inspectionQuestionId: 1,
                inspectionAnswerOptionId: 5,
                isDeleted: false
            }],
            inspectionAnswerOptions: [{
                id: 5,
                inspectionQuestionId: 1,
                answerOptionId: 50,
                score: 8,
                useFlag: true
            }],
            inspectionQuestionResponseContents: [],
            inspectionQuestionConditionals: []
        };
        
        const result = calculator.calculateScore(input);
        
        expect(result.inspectionQuestions[0].score).toBe(8);
        expect(result.inspectionPages[0].score).toBe(8);
        expect(result.inspection.score).toBe(8);
    });
    
    test('should deduct page score when conditional is met', () => {
        const input: CalculateScoreInput = {
            inspection: { id: 1, questionnaireId: 1, score: 0, maxScore: 0 },
            inspectionPages: [{ id: 1, inspectionId: 1, questionPageId: 1, title: 'P1', orderNumber: 1 }],
            inspectionQuestions: [{
                id: 1,
                inspectionId: 1,
                inspectionPageId: 1,
                questionId: 1,
                questionPageId: 1,
                questionTypeId: QuestionType.QUESTION,
                answerTypeId: AnswerType.SINGLE_CHOICE,
                useScore: true,
                maxScore: 10,
                orderNumber: 1
            }],
            inspectionQuestionAnswers: [{
                id: 1,
                inspectionQuestionId: 1,
                inspectionAnswerOptionId: 5,
                isDeleted: false
            }],
            inspectionAnswerOptions: [{
                id: 5,
                inspectionQuestionId: 1,
                answerOptionId: 50,
                score: 8,
                useFlag: true
            }],
            inspectionQuestionResponseContents: [],
            inspectionQuestionConditionals: [{
                id: 1,
                inspectionQuestionId: 1,
                conditionalOperatorId: ConditionalOperator.SINGLE_CHOICE_IS,
                inspectionQuestionConditionalAnswerOptions: [{
                    id: 1,
                    inspectionQuestionConditionalId: 1,
                    inspectionAnswerOptionId: 5
                }],
                inspectionQuestionConditionalResponseContents: [],
                inspectionQuestionConditionalContents: [{
                    id: 1,
                    inspectionQuestionConditionalId: 1,
                    conditionalTriggerId: ConditionalTrigger.DEDUCT_PAGE_POINT,
                    isRequireNote: false,
                    isRequireMedia: false
                }]
            }]
        };
        
        const result = calculator.calculateScore(input);
        
        expect(result.inspectionQuestions[0].isDeductedPageScore).toBe(true);
        expect(result.inspectionPages[0].score).toBe(0);
    });
});
```

---

## VIII. CHECKLIST TRI?N KHAI

- [ ] **B??c 1**: Copy t?t c? enums (AnswerType, QuestionType, ConditionalOperator, ConditionalTrigger)
- [ ] **B??c 2**: Copy t?t c? interfaces
- [ ] **B??c 3**: Copy class `InspectionScoreCalculator`
- [ ] **B??c 4**: Test v?i data m?u (không có conditional)
- [ ] **B??c 5**: Test v?i data có conditional (deduct points)
- [ ] **B??c 6**: Test v?i question section
- [ ] **B??c 7**: Integration vào service/hook/composable
- [ ] **B??c 8**: Validate data tr??c khi tính ?i?m
- [ ] **B??c 9**: Add error handling
- [ ] **B??c 10**: Optimize performance (cache, memoization)
- [ ] **B??c 11**: Add debugging mode
- [ ] **B??c 12**: Write unit tests

---

## IX. T?NG K?T

**?u ?i?m:**
- ? Client t? tính ?i?m tr??c khi g?i lên server
- ? User xem ???c ?i?m preview tr??c khi finish
- ? Gi?m t?i server (không c?n recalculate m?i l?n)
- ? Offline-capable (tính ?i?m khi m?t m?ng)

**L?u ý:**
- ?? Server v?n ph?i tính l?i ?i?m (validation cu?i cùng)
- ?? Client c?n sync logic v?i server khi có thay ??i
- ?? C?n validate data ??y ?? tr??c khi tính

**Khi nào dùng:**
- Khi user nh?n "Preview Score" (tính và hi?n th?)
- Tr??c khi g?i API Finish (tính và g?i kèm)
- KHÔNG dùng: Sau m?i l?n user tr? l?i câu h?i (quá t?n tài nguyên)

---

**Version:** 1.0  
**Last Updated:** 2026-01-28  
**Author:** Backend Team  
**Reviewed By:** Frontend Team Lead
