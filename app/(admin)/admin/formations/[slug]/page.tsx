import { notFound } from 'next/navigation'
import { getCourseStore } from '@/lib/courses/store'
import CourseEditor from '@/components/admin/CourseEditor'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Éditer un cours — Hub Admin' }

export default async function EditCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = await getCourseStore(slug)
  if (!course) notFound()
  return <CourseEditor initial={course} isNew={false} />
}
