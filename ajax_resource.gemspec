require 'tasks/build'

AJAX_RESOURCE_VERSION = '0.01'

# first build the library
Rake::Task["ajax_resource:build"].execute

Gem::Specification.new do |s|
  s.name = "ajax_resource"
  s.version = AJAX_RESOURCE_VERSION
  s.authors = [ "Dmitry Ratnikov" ]
  s.date = Time.now
  s.email = 'dmitryr@webitects.com'
  s.has_rdoc = false
  s.summary = "Javascript implementation of REST interface"

  s.files = [ 'build/ajax_resource-min.js', 'build/ajax_resource-src.js', 'tasks/ajax_resource.rb' ]
  s.require_path = '.'
end
