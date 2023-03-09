import { Job, Company } from "./db.js"
export const resolvers = {
    Query: {
        job: (_root, { id }) => Job.findById(id),
        company: (_root, { id }) =>Company.findById(id),
        jobs: () => Job.findAll()
    },
    Mutation: {
        createJob: (_root, { input }, { user }) => {
            if (!user) {
                throw new Error("Unauthorized")
            }
            return Job.create({ ...input,companyId:user.companyId })
        },
        deleteJob: async (_root, { id }, { user }) => {
            if (!user) {
                throw new Error("Unauthorized")
            }
            const job = await Job.findById(id);
            if (job.companyId !== user.companyId) {
                throw new Error('Unauthorized');
            }
            return Job.delete(id)
        },
        updateJob: async (_root, { input }, { user }) => {
            if (!user) {
                throw new Error("Unauthorized")
            }
            const job = await Job.findById(input.id);
            if (job.companyId !== user.companyId) {
                throw new Error('Unauthorized');
            }
            return Job.update({ ...input,companyId:user.companyId });
        }
    },
    Company: {
        jobs: (company) => {
            return Job.findAll((job)=> job.companyId === company.id)
        }
    },
    Job: {
        company: (job) => {
            return Company.findById(job.companyId);
        }
    }
}