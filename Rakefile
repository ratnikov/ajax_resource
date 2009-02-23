require 'tasks/ajax_resource'

desc "Runs jslint on all files in the src directory"
task :jslint do
  puts "Running jslint..."
  with_errors = []
  Dir.glob("src/**/*js").each do |file|
    unless (report = `cat #{file} | jslint`) =~ /No problems found/
      with_errors << file
      puts <<-REPORT_END
----------------
#{file} problems:
 
#{report}
      REPORT_END
    end
  end

  unless with_errors.size == 0
    puts "Following files had problems:"
    with_errors.each { |file| puts " - #{file}" }
  else
    puts "All good."
  end
end
