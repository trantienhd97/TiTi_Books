
1.	SyncInspectionInformation: 
•	Endpoint: POST /rpc/work/inspection/sync-inspection-information
•	Mục đích: thay đổi thông tin ở tab Thông tin chung
•	Request body: object DTO Inspection_InspectionInformationHistoryDTO cần tối thiểu:
	 + InspectionId (long) — id của Inspection
	 + InspectionInformationId (long) — id của mục information
	 + EventId (GUID) — duy nhất cho mỗi thay đổi, client gen GUID
	 + ModifiedAt (DateTime) — thời điểm sửa nội dung (UTC), client action time, không phải call API time
	 + Các field thay đổi: Note, SiteId, Date, AppUserId tùy loại
	 + InspectionInformationHistoryFileMappings: nếu xóa file, set IsDeleted = true

2.	SyncQuestion
•	Endpoint: POST /rpc/work/inspection/sync-question
•	Mục đích: Cập nhật giá trị Ghi chú/File đính kèm trong câu hỏi
•	Request body: object DTO Inspection_InspectionQuestionHistoryDTO. Cần tối thiểu:
	 + InspectionId (long)
	 + InspectionQuestionId (long)
	 + EventId: client gen GUID
	 + ModifiedAt (DateTime): thời điểm sửa nội dung (UTC), client action time, không phải call API time
	 + Note (string) (nếu thay đổi)
	 + InspectionQuestionHistoryFileMappings: nếu xóa file, set IsDeleted = true

3.	SyncQuestionAnswer
•	Endpoint: POST /rpc/work/inspection/sync-question-answer
•	Mục đích: Đồng bộ lịch sử trả lời câu hỏi.
•	Request body: object DTO Inspection_InspectionQuestionHistoryDTO:
	+ InspectionId (long)
	+ InspectionQuestionId (long)
	+ EventId (GUID)
	+ ModifiedAt (DateTime UTC)
	+ InspectionQuestionAnswerHistories: tương tự mảng InspectionQuestionAnswers, mỗi object chứa:
	+ InspectionAnswerOptionId (nullable)
	+ InspectionQuestionResponseContentId (nullable)
	+ ImageId (nullable) — nếu image kèm theo
	+ Date, TextValue, NumberValue, Latitude, Longitude, Address

Lưu ý quan trọng cho client
•	Luôn tạo EventId duy nhất cho mỗi thay đổi (UUID/GUID). Khi retry do mạng lỗi, sử dụng lại cùng EventId để tránh duplicate.
•	ModifiedAt phải chính xác và ở UTC. Server dùng ModifiedAt để so sánh thứ tự sự kiện.
•	Nếu client muốn gửi nhiều thay đổi offline, gửi thành các event riêng biệt với EventId khác nhau; server sẽ sắp xếp theo ModifiedAt.


# TÀI LIỆUU VALIDATION CLIENT-SIDE CHO INSPECTION SYSTEM

## I. TỔNG QUAN

Hệ thống Inspection có 2 loại validation chính cần client thực hiện:
1. **Validation khi trả lời câu hỏi** (`UpdateQuestionAnswer`)
2. **Validation khi hoàn thành Inspection** (`Finish`)

Cả hai đều dựa trên:
- **Required validation**: Câu hỏi bắt buộc phải trả lời
- **Conditional validation**: Kiểm tra điều kiện logic dựa trên câu trả lời (Question Conditionals)

---

## II. CẤU TRÚC DỮ LIỆU QUAN TR?NG

### 1. AnswerType (Loạii câu trả lời)
```typescript
enum AnswerType {
    SINGLE_CHOICE = 1,      // Chọn 1
    MULTIPLE_CHOICE = 2,    // Chọn nhiều
    TEXT = 3,               // Văn bản
    NUMBER = 4,             // Số
    DATETIME = 5,           // Ngày giờ
    IMAGE = 6,              // Hình ảnh
    // ... các loại khác
}
```

### 2. ConditionalOperator (Toán tử điều kiện)
```typescript
enum ConditionalOperator {
    // SINGLE CHOICE
    SINGLE_CHOICE_IS = 1,
    SINGLE_CHOICE_IS_NOT = 2,
    SINGLE_CHOICE_IS_ONE_OF = 3,
    SINGLE_CHOICE_IS_NOT_ONE_OF = 4,
    SINGLE_CHOICE_IS_SELECTED = 5,
    SINGLE_CHOICE_IS_NOT_SELECTED = 6,
    
    // MULTIPLE CHOICE
    MULTIPLE_CHOICE_IS = 7,
    MULTIPLE_CHOICE_IS_NOT = 8,
    MULTIPLE_CHOICE_IS_ONE_OF = 9,
    MULTIPLE_CHOICE_IS_NOT_ONE_OF = 10,
    MULTIPLE_CHOICE_IS_SELECTED = 11,
    MULTIPLE_CHOICE_IS_NOT_SELECTED = 12,
    
    // TEXT
    TEXT_IS = 13,
    TEXT_IS_NOT = 14,
    
    // NUMBER
    NUMBER_LESS = 15,
    NUMBER_LESS_EQUAL = 16,
    NUMBER_GREATER = 17,
    NUMBER_GREATER_EQUAL = 18,
    NUMBER_EQUAL = 19,
    NUMBER_NOT_EQUAL = 20,
    NUMBER_BETWEEN = 21,
    NUMBER_NOT_BETWEEN = 22,
}
```

### 3. ConditionalTrigger (Hành động kích hoạt)
```typescript
enum ConditionalTrigger {
    REQUIRE_ACTION = 1,         // Yêu cầu tạo task
    REQUIRE_EVIDENCE = 2,       // Yêu cầu bằng chứng (note/file)
    AUTO_CREATE_ACTION = 3,     // Tự động tạo task (server-side)
    NOTIFY = 4,                 // Gửi thông báo (server-side)
    DEDUCT_PAGE_POINT = 5,      // Trừ điểm trang
    DEDUCT_SECTION_POINT = 6,   // Trừ điểm section
    DEDUCT_FORM_POINT = 7,      // Trừ điểm form
    IGNORE_POINT = 8,           // Bỏ qua tính điểm
}
```

### 4. QuestionType
```typescript
enum QuestionType {
    QUESTION = 1,           // Câu hỏi thường
    QUESTION_SECTION = 2,   // Section chứa câu hỏi con
}
```

---

## III. INTERFACES DỮ LIỆU

```typescript
interface InspectionQuestion {
    id: number;
    answerTypeId: number;
    questionTypeId: number;
    isRequired: boolean;
    useFlag: boolean;
    note?: string;
    content: string;
    questionnaireResponseSetId?: number;
    inspectionQuestionAnswers: InspectionQuestionAnswer[];
    inspectionQuestionFileMappings: InspectionQuestionFileMapping[];
    inspectionQuestionConditionals: InspectionQuestionConditional[];
    inspectionQuestions?: InspectionQuestion[]; // Cho QUESTION_SECTION
    taskAssignments?: TaskAssignment[];
}

interface InspectionQuestionAnswer {
    inspectionAnswerOptionId?: number;
    inspectionQuestionResponseContentId?: number;
    textValue?: string;
    numberValue?: number;
    date?: Date;
    imageId?: number;
}

interface InspectionQuestionConditional {
    conditionalOperatorId: number;
    textValue?: string;
    numberValue?: number;
    numberFromValue?: number;
    numberToValue?: number;
    inspectionQuestionConditionalAnswerOptions: Array<{
        inspectionAnswerOptionId: number;
    }>;
    inspectionQuestionConditionalResponseContents: Array<{
        inspectionQuestionResponseContentId: number;
    }>;
    inspectionQuestionConditionalContents: InspectionQuestionConditionalContent[];
}

interface InspectionQuestionConditionalContent {
    conditionalTriggerId: number;
    isRequireNote: boolean;
    isRequireMedia: boolean;
}

interface ValidationResult {
    isValid: boolean;
    warnings?: Warning[];
    errors?: Error[];
}

interface Warning {
    field: string;
    questionId?: number;
    questionContent?: string;
    page?: string;
    code: string;
    message: string;
}

interface Error {
    field: string;
    questionId?: number;
    questionContent?: string;
    page?: string;
    code: string;
    message: string;
}
```

---

## IV. CODE MẪU HOÀN CHỈNH (TypeScript/JavaScript)

### File: InspectionValidator.ts

```typescript
// ============================================
// FILE: InspectionValidator.ts
// ============================================

export class InspectionValidator {
    
    /**
     * Validate khi user trả lời câu hỏi (real-time)
     * Trả về WARNING (không chặn, chỉ cảnh báo)
     */
    validateQuestionAnswer(
        question: InspectionQuestion,
        taskAssignments: TaskAssignment[]
    ): ValidationResult {
        const warnings: Warning[] = [];
        
        if (!question.inspectionQuestionConditionals || 
            question.inspectionQuestionConditionals.length === 0) {
            return { isValid: true, warnings };
        }
        
        const taskAssignment = taskAssignments.find(
            t => t.inspectionQuestionId === question.id
        );
        
        for (const conditional of question.inspectionQuestionConditionals) {
            const isConditionMet = this.evaluateConditional(question, conditional);
            
            if (isConditionMet) {
                for (const content of conditional.inspectionQuestionConditionalContents || []) {
                    
                    if (content.conditionalTriggerId === ConditionalTrigger.REQUIRE_ACTION) {
                        if (!taskAssignment) {
                            warnings.push({
                                field: 'id',
                                questionId: question.id,
                                questionContent: question.content,
                                code: 'InspectionQuestionAnswer_RequireAction',
                                message: 'Câu hỏi này yêu cầu tạo task xử lý'
                            });
                        }
                    }
                    
                    if (content.conditionalTriggerId === ConditionalTrigger.REQUIRE_EVIDENCE) {
                        const hasNote = question.note && question.note.trim().length > 0;
                        const hasMedia = question.inspectionQuestionFileMappings && 
                                       question.inspectionQuestionFileMappings.length > 0;
                        
                        if (content.isRequireNote && content.isRequireMedia) {
                            if (!hasNote && !hasMedia) {
                                warnings.push({
                                    field: 'id',
                                    questionId: question.id,
                                    questionContent: question.content,
                                    code: 'InspectionQuestionAnswer_RequireEvidenceAttachmentAndNote',
                                    message: 'Câu hỏi này yêu cầu có ghi chú và tệp đính kèm'
                                });
                            }
                            if (!hasNote) {
                                warnings.push({
                                    field: 'id',
                                    questionId: question.id,
                                    questionContent: question.content,
                                    code: 'InspectionQuestionAnswer_RequireEvidenceNote',
                                    message: 'Câu hỏi này yêu cầu ghi chú'
                                });
                            }
                            if (!hasMedia) {
                                warnings.push({
                                    field: 'id',
                                    questionId: question.id,
                                    questionContent: question.content,
                                    code: 'InspectionQuestionAnswer_RequireEvidenceAttachment',
                                    message: 'Câu hỏi này yêu cầu tệp đính kèm'
                                });
                            }
                        } else {
                            if (content.isRequireNote && !hasNote) {
                                warnings.push({
                                    field: 'id',
                                    questionId: question.id,
                                    questionContent: question.content,
                                    code: 'InspectionQuestionAnswer_RequireEvidenceNote',
                                    message: 'Câu hỏi này yêu cầu ghi chú'
                                });
                            }
                            if (content.isRequireMedia && !hasMedia) {
                                warnings.push({
                                    field: 'id',
                                    questionId: question.id,
                                    questionContent: question.content,
                                    code: 'InspectionQuestionAnswer_RequireEvidenceAttachment',
                                    message: 'Câu hỏi này yêu cầu tệp đính kèm'
                                });
                            }
                        }
                    }
                }
            }
        }
        
        return { 
            isValid: warnings.length === 0, 
            warnings 
        };
    }
    
    /**
     * Validate toàn bộ inspection trước khi finish
     * Trả về ERROR (chọn không cho finish nếu có lỗi)
     */
    validateBeforeFinish(
        inspection: Inspection,
        isAdmin: boolean = false
    ): ValidationResult {
        const errors: Error[] = [];
        
        // 1. Validate Survey
        if (inspection.isSurvey === true) {
            if (!inspection.surveyId || inspection.surveyId === 0) {
                errors.push({
                    field: 'surveyId',
                    code: 'SurveyNotExisted',
                    message: 'Survey không tồn tại'
                });
            }
        } else {
            // 2. Validate Permission
            if (!inspection.canUpdate && !isAdmin) {
                errors.push({
                    field: 'questionnaireId',
                    code: 'IdNotPermission',
                    message: 'Không có quyền finish inspection này'
                });
            }
        }
        
        // 3. Validate tổng Page
        for (const page of inspection.inspectionPages) {
            let hasErrorInPage = false;
            
            for (const question of page.inspectionQuestions) {
                
                // Xử lý QUESTION_SECTION
                if (question.questionTypeId === QuestionType.QUESTION_SECTION) {
                    for (const subQuestion of question.inspectionQuestions || []) {
                        const questionErrors = this.validateRequiredQuestion(
                            subQuestion, 
                            page.title
                        );
                        
                        if (questionErrors.length > 0) {
                            hasErrorInPage = true;
                            errors.push(...questionErrors);
                        }
                        
                        // Validate conditionals (ch? cho non-survey)
                        if (!inspection.isSurvey) {
                            const conditionalErrors = this.validateQuestionConditionals(
                                subQuestion,
                                page.title
                            );
                            if (conditionalErrors.length > 0) {
                                hasErrorInPage = true;
                                errors.push(...conditionalErrors);
                            }
                        }
                    }
                } 
                // Xử lý QUESTION thường
                else {
                    const questionErrors = this.validateRequiredQuestion(
                        question, 
                        page.title
                    );
                    
                    if (questionErrors.length > 0) {
                        hasErrorInPage = true;
                        errors.push(...questionErrors);
                    }
                    
                    // Validate conditionals (chỉ cho non-survey)
                    if (!inspection.isSurvey) {
                        const conditionalErrors = this.validateQuestionConditionals(
                            question,
                            page.title
                        );
                        if (conditionalErrors.length > 0) {
                            hasErrorInPage = true;
                            errors.push(...conditionalErrors);
                        }
                    }
                }
            }
            
            // Nếu page có lỗi, thêm error cho page
            if (hasErrorInPage) {
                errors.push({
                    field: 'inspectionPageId',
                    page: page.title,
                    code: 'InspectionPageHasError',
                    message: `Trang "${page.title}" có lỗi cần xử lý`
                });
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    /**
     * Validate câu hỏi bắt buộc
     */
    private validateRequiredQuestion(
        question: InspectionQuestion,
        pageTitle: string
    ): Error[] {
        const errors: Error[] = [];
        
        if (!question.isRequired) {
            return errors;
        }
        
        const hasAnswer = question.inspectionQuestionAnswers && 
                         question.inspectionQuestionAnswers.length > 0;
        
        if (!hasAnswer) {
            errors.push({
                field: 'id',
                page: pageTitle,
                question: question.content,
                code: 'InspectionQuestionAnswer_QuestionNotAnswered',
                message: `Câu hỏi bắt buộc "${question.content}" chứa được trả lời`
            });
            return errors;
        }
        
        const answer = question.inspectionQuestionAnswers[0];
        
        switch (question.answerTypeId) {
            case AnswerType.DATETIME:
                if (!answer.date) {
                    errors.push({
                        field: 'id',
                        page: pageTitle,
                        question: question.content,
                        code: 'InspectionQuestionAnswer_QuestionNotAnswered',
                        message: 'Câu hỏi yêu cầu chọn ngày giờ'
                    });
                }
                break;
                
            case AnswerType.NUMBER:
                if (answer.numberValue === undefined || answer.numberValue === null) {
                    errors.push({
                        field: 'id',
                        page: pageTitle,
                        question: question.content,
                        code: 'InspectionQuestionAnswer_QuestionNotAnswered',
                        message: 'Câu hỏi yêu cầu nhập số'
                    });
                }
                break;
                
            case AnswerType.TEXT:
                if (!answer.textValue || answer.textValue.trim().length === 0) {
                    errors.push({
                        field: 'id',
                        page: pageTitle,
                        question: question.content,
                        code: 'InspectionQuestionAnswer_QuestionNotAnswered',
                        message: 'Câu hỏi yêu cầu nhập văn bản'
                    });
                }
                break;
                
            case AnswerType.IMAGE:
                if (!answer.imageId) {
                    errors.push({
                        field: 'id',
                        page: pageTitle,
                        question: question.content,
                        code: 'InspectionQuestionAnswer_QuestionNotAnswered',
                        message: 'Câu hỏi yêu cầu tải lên hình ảnh'
                    });
                }
                break;
                
            case AnswerType.SINGLE_CHOICE:
            case AnswerType.MULTIPLE_CHOICE:
                if (!answer.inspectionAnswerOptionId && 
                    !answer.inspectionQuestionResponseContentId) {
                    errors.push({
                        field: 'id',
                        page: pageTitle,
                        question: question.content,
                        code: 'InspectionQuestionAnswer_QuestionNotAnswered',
                        message: 'Câu hỏi yêu cầu chọn đáp án'
                    });
                }
                break;
        }
        
        return errors;
    }
    
    /**
     * Validate conditional rules (ERRORS - chặn finish)
     */
    private validateQuestionConditionals(
        question: InspectionQuestion,
        pageTitle: string
    ): Error[] {
        const errors: Error[] = [];
        
        if (!question.inspectionQuestionConditionals) {
            return errors;
        }
        
        for (const conditional of question.inspectionQuestionConditionals) {
            const isConditionMet = this.evaluateConditional(question, conditional);
            
            if (isConditionMet) {
                for (const content of conditional.inspectionQuestionConditionalContents || []) {
                    
                    if (content.conditionalTriggerId === ConditionalTrigger.REQUIRE_ACTION) {
                        if (!question.taskAssignments || question.taskAssignments.length === 0) {
                            errors.push({
                                field: 'id',
                                page: pageTitle,
                                question: question.content,
                                code: 'InspectionQuestionAnswer_RequireAction',
                                message: 'Câu hỏi này yêu cầu tạo task xử lý'
                            });
                        }
                    }
                    
                    if (content.conditionalTriggerId === ConditionalTrigger.REQUIRE_EVIDENCE) {
                        const hasNote = question.note && question.note.trim().length > 0;
                        const hasMedia = question.inspectionQuestionFileMappings && 
                                       question.inspectionQuestionFileMappings.length > 0;
                        
                        if (content.isRequireNote && content.isRequireMedia) {
                            if (!hasNote && !hasMedia) {
                                errors.push({
                                    field: 'id',
                                    page: pageTitle,
                                    question: question.content,
                                    code: 'InspectionQuestionAnswer_RequireEvidenceAttachmentAndNote',
                                    message: 'Yêu cầu cả ghi chú và tệp đính kèm'
                                });
                            }
                            if (!hasNote) {
                                errors.push({
                                    field: 'id',
                                    page: pageTitle,
                                    question: question.content,
                                    code: 'InspectionQuestionAnswer_RequireEvidenceNote',
                                    message: 'Yêu cầu ghi chú'
                                });
                            }
                            if (!hasMedia) {
                                errors.push({
                                    field: 'id',
                                    page: pageTitle,
                                    question: question.content,
                                    code: 'InspectionQuestionAnswer_RequireEvidenceAttachment',
                                    message: 'Yêu cầu tệp đính kèm'
                                });
                            }
                        } else {
                            if (content.isRequireNote && !hasNote) {
                                errors.push({
                                    field: 'id',
                                    page: pageTitle,
                                    question: question.content,
                                    code: 'InspectionQuestionAnswer_RequireEvidenceNote',
                                    message: 'Yêu cầu ghi chú'
                                });
                            }
                            if (content.isRequireMedia && !hasMedia) {
                                errors.push({
                                    field: 'id',
                                    page: pageTitle,
                                    question: question.content,
                                    code: 'InspectionQuestionAnswer_RequireEvidenceAttachment',
                                    message: 'Yêu cầu tệp đính kèm'
                                });
                            }
                        }
                    }
                }
            }
        }
        
        return { 
            isValid: warnings.length === 0, 
            warnings 
        };
    }
    
    /**
     * Đánh giá điều kiện conditional
     */
    private evaluateConditional(
        question: InspectionQuestion,
        conditional: InspectionQuestionConditional
    ): boolean {
        
        if (question.answerTypeId === AnswerType.SINGLE_CHOICE) {
            if (!question.questionnaireResponseSetId) {
                const chosenId = question.inspectionQuestionAnswers
                    .find(a => a.inspectionAnswerOptionId)
                    ?.inspectionAnswerOptionId;
                    
                const conditionalIds = conditional.inspectionQuestionConditionalAnswerOptions
                    .map(x => x.inspectionAnswerOptionId);
                    
                return this.evaluateSingleChoice(
                    chosenId, 
                    conditional.conditionalOperatorId, 
                    conditionalIds
                );
            } else {
                const chosenId = question.inspectionQuestionAnswers
                    .find(a => a.inspectionQuestionResponseContentId)
                    ?.inspectionQuestionResponseContentId;
                    
                const conditionalIds = conditional.inspectionQuestionConditionalResponseContents
                    .map(x => x.inspectionQuestionResponseContentId);
                    
                return this.evaluateSingleChoice(
                    chosenId, 
                    conditional.conditionalOperatorId, 
                    conditionalIds
                );
            }
        }
        
        else if (question.answerTypeId === AnswerType.MULTIPLE_CHOICE) {
            if (!question.questionnaireResponseSetId) {
                const chosenIds = question.inspectionQuestionAnswers
                    .filter(a => a.inspectionAnswerOptionId)
                    .map(a => a.inspectionAnswerOptionId!);
                    
                const conditionalIds = conditional.inspectionQuestionConditionalAnswerOptions
                    .map(x => x.inspectionAnswerOptionId);
                    
                return this.evaluateMultipleChoice(
                    chosenIds, 
                    conditional.conditionalOperatorId, 
                    conditionalIds
                );
            } else {
                const chosenIds = question.inspectionQuestionAnswers
                    .filter(a => a.inspectionQuestionResponseContentId)
                    .map(a => a.inspectionQuestionResponseContentId!);
                    
                const conditionalIds = conditional.inspectionQuestionConditionalResponseContents
                    .map(x => x.inspectionQuestionResponseContentId);
                    
                return this.evaluateMultipleChoice(
                    chosenIds, 
                    conditional.conditionalOperatorId, 
                    conditionalIds
                );
            }
        }
        
        else if (question.answerTypeId === AnswerType.TEXT) {
            const textValue = question.inspectionQuestionAnswers
                .find(a => a.textValue)
                ?.textValue;
                
            return this.evaluateText(
                textValue, 
                conditional.conditionalOperatorId, 
                conditional.textValue
            );
        }
        
        else if (question.answerTypeId === AnswerType.NUMBER) {
            const numberValue = question.inspectionQuestionAnswers
                .find(a => a.numberValue !== undefined)
                ?.numberValue;
                
            if (numberValue === undefined) return false;
            
            return this.evaluateNumber(
                numberValue,
                conditional.conditionalOperatorId,
                conditional.numberValue,
                conditional.numberFromValue,
                conditional.numberToValue
            );
        }
        
        return false;
    }
    
    private evaluateSingleChoice(
        chosenId: number | undefined,
        operatorId: number,
        conditionalIds: number[]
    ): boolean {
        const conditionalId = conditionalIds[0];
        
        switch (operatorId) {
            case ConditionalOperator.SINGLE_CHOICE_IS:
                return chosenId === conditionalId;
            case ConditionalOperator.SINGLE_CHOICE_IS_NOT:
                return chosenId !== conditionalId;
            case ConditionalOperator.SINGLE_CHOICE_IS_ONE_OF:
                return chosenId ? conditionalIds.includes(chosenId) : false;
            case ConditionalOperator.SINGLE_CHOICE_IS_NOT_ONE_OF:
                return chosenId ? !conditionalIds.includes(chosenId) : true;
            case ConditionalOperator.SINGLE_CHOICE_IS_SELECTED:
                return chosenId !== undefined && chosenId !== null;
            case ConditionalOperator.SINGLE_CHOICE_IS_NOT_SELECTED:
                return chosenId === undefined || chosenId === null;
            default:
                return false;
        }
    }
    
    private evaluateMultipleChoice(
        chosenIds: number[],
        operatorId: number,
        conditionalIds: number[]
    ): boolean {
        switch (operatorId) {
            case ConditionalOperator.MULTIPLE_CHOICE_IS:
                const diff1 = chosenIds.filter(x => !conditionalIds.includes(x));
                const diff2 = conditionalIds.filter(x => !chosenIds.includes(x));
                return diff1.length === 0 && diff2.length === 0;
                
            case ConditionalOperator.MULTIPLE_CHOICE_IS_NOT:
                const diff3 = chosenIds.filter(x => !conditionalIds.includes(x));
                const diff4 = conditionalIds.filter(x => !chosenIds.includes(x));
                return diff3.length > 0 || diff4.length > 0;
                
            case ConditionalOperator.MULTIPLE_CHOICE_IS_ONE_OF:
                const intersection1 = chosenIds.filter(x => conditionalIds.includes(x));
                return intersection1.length > 0;
                
            case ConditionalOperator.MULTIPLE_CHOICE_IS_NOT_ONE_OF:
                const intersection2 = chosenIds.filter(x => conditionalIds.includes(x));
                return intersection2.length === 0;
                
            case ConditionalOperator.MULTIPLE_CHOICE_IS_SELECTED:
                return chosenIds.length > 0;
                
            case ConditionalOperator.MULTIPLE_CHOICE_IS_NOT_SELECTED:
                return chosenIds.length === 0;
                
            default:
                return false;
        }
    }
    
    private evaluateText(
        textValue: string | undefined,
        operatorId: number,
        conditionalText: string | undefined
    ): boolean {
        switch (operatorId) {
            case ConditionalOperator.TEXT_IS:
                return !!(textValue && conditionalText && 
                         textValue.includes(conditionalText));
            case ConditionalOperator.TEXT_IS_NOT:
                return !textValue || !conditionalText || 
                       !textValue.includes(conditionalText);
            default:
                return false;
        }
    }
    
    private evaluateNumber(
        numberValue: number,
        operatorId: number,
        conditionalValue?: number,
        fromValue?: number,
        toValue?: number
    ): boolean {
        switch (operatorId) {
            case ConditionalOperator.NUMBER_LESS:
                return conditionalValue !== undefined && numberValue < conditionalValue;
            case ConditionalOperator.NUMBER_LESS_EQUAL:
                return conditionalValue !== undefined && numberValue <= conditionalValue;
            case ConditionalOperator.NUMBER_GREATER:
                return conditionalValue !== undefined && numberValue > conditionalValue;
            case ConditionalOperator.NUMBER_GREATER_EQUAL:
                return conditionalValue !== undefined && numberValue >= conditionalValue;
            case ConditionalOperator.NUMBER_EQUAL:
                return conditionalValue !== undefined && numberValue === conditionalValue;
            case ConditionalOperator.NUMBER_NOT_EQUAL:
                return conditionalValue !== undefined && numberValue !== conditionalValue;
            case ConditionalOperator.NUMBER_BETWEEN:
                return fromValue !== undefined && toValue !== undefined &&
                       fromValue <= numberValue && numberValue <= toValue;
            case ConditionalOperator.NUMBER_NOT_BETWEEN:
                return fromValue !== undefined && toValue !== undefined &&
                       (numberValue < fromValue || numberValue > toValue);
            default:
                return false;
        }
    }
}
```

---
