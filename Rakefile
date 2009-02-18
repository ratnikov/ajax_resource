require 'rake'

desc "Cleans up the javascript build."
task :clean do
  FileUtils.rm_r(File.dirname(__FILE__) + '/build')
end

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

desc "Builds the javascript library."
task :build do
  puts `jake --force`
  puts "Done building."
end

task :default => [ :jslint, :build ]
