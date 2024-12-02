import { computed, MaybeRef, unref } from "vue"
import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { Person } from "@/db/models/Person"
import { peopleKeys } from "@people/queries/peopleKeys"
import { usePerson } from "@people/queries/usePerson"
import { updateInStore } from "@/db/useDatabase"

interface UseUpdatePersonParams {
	id: MaybeRef<number>
}

export function useUpdatePerson({ id }: UseUpdatePersonParams) {
	const queryClient = useQueryClient()
	const { data: originalPerson } = usePerson({ id })

	return useMutation({
		mutationFn: computed(
			() =>
				async (person: Partial<Omit<Person, "id">>): Promise<Person> => {
					if (!originalPerson.value) {
						return Promise.reject(new Error("Original no encontrado"))
					}

					const data: Person = {
						id: originalPerson.value.id,
						name: originalPerson.value.name,
						colony: originalPerson.value.colony,
						description: originalPerson.value.description,
						location: originalPerson.value.location
							? {
									latitude: originalPerson.value.location.latitude,
									longitude: originalPerson.value.location.longitude,
									altitude: originalPerson.value.location.altitude,
							  }
							: undefined,
						...person,
					}

					const personId = await updateInStore("people", unref(id), data)

					return {
						...data,
						id: personId,
					}
				}
		),
		onSuccess: (person) => {
			queryClient.invalidateQueries({ queryKey: peopleKeys.all() })
			queryClient.setQueryData(peopleKeys.detail(person.id), person)
		},
	})
}
