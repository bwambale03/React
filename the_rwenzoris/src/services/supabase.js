
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

// Example usage of supabase to remove the unused variable error
const supabase = createClient(supabaseUrl, supabaseKey)

// Example: Fetch data from a table
async function fetchData() {
	const { data, error } = await supabase.from('your_table_name').select('*')
	if (error) {
		console.error('Error fetching data:', error)
	} else {
		console.log('Fetched data:', data)
	}
}

fetchData()

export default supabase;
