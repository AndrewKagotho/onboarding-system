import { api } from '../utils/libs/axios'

const getOne = async (id: string) => api(`/v1/submissions/${id}`)

const uploadFile = async (files: Record<string, any>[]) => {
  const allRequests: any = []
  const allResults: any = []

  files.forEach((newFile) => {
    allRequests.push(
      api.post('/v1/submissions/upload-file', newFile.file, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    )
  })

  const allRes = await Promise.all(allRequests)
  const uploadData = allRes.map(({ data }) => data)

  files.forEach((file) => {
    const fileUploadData = uploadData.find(({ path }) => file.name === path)
    allResults.push({
      ...fileUploadData,
      questionId: file.questionId
    })
  })

  return allResults
}

const create = async (newSubmission: Record<string, any>) => {
  if (newSubmission.filesData) {
    const results = await uploadFile(newSubmission.filesData)

    delete newSubmission.filesData

    newSubmission.sections.forEach(({ questions }: any) => {
      questions.forEach((question: any) => {
        const questionUploadRes = results.find(
          ({ questionId }: { questionId: string }) => questionId === question.id
        )
        if (questionUploadRes) {
          question.answer = {
            fullPath: questionUploadRes.fullPath,
            id: questionUploadRes.id,
            path: questionUploadRes.path
          }
        }
      })
    })
  }

  return api.post(`/v1/submissions`, newSubmission)
}

export const SubmissionService = {
  getOne,
  create
}
