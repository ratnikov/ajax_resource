
namespace :ajax_resource do
  namespace :rails do
    desc "Re-builds the library" 
    task :build do
      require 'jake'
      Jake.build File.join(File.dirname(__FILE__), '..'), true
    end

    desc "Installs ajax_resource javascript in the public/javascripts directory. Set COMPRESS=true to install the compressed version."
    task :install => [ :build ] do
      extension = ENV["COMPRESS"] == "true" ? "min" : "src"
      from = File.join File.dirname(__FILE__), '..', 'build', "ajax_resource-#{extension}.js"
      to = File.join Rails.root, 'public', 'javascripts', 'ajax_resource.js'
      FileUtils.cp(from, to, :verbose => true);
      puts "Done installing." 
    end
  end
end
