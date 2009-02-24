
namespace :ajax_resource do
  namespace :rails do
    desc "Installs ajax_resource javascript in the public/javascripts directory. Set COMPRESS=true to install the compressed version."
    task :install do
      require 'jake'

      build = Jake::Build.new File.join(File.dirname(__FILE__), '..')

      class << build
	def build_directory
	  File.join Rails.root, 'public', 'javascripts'
	end
      end

      build.force!
      build.run!

      puts "Installed to #{build.build_directory}"
    end
  end
end
